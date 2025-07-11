import pool from "../db/db.js";
import { z } from "zod";
import { stockMovementsSchema } from "../schemas/stockMovementsSchema.js";
import { handleServerError, handleZodError } from "../utils/dataValidation.js";
import { buildInsertQuery } from "../utils/queryBuilder.js";

// POST creo un nuovo spostamento merce
export async function createStockMovement(req, res) {
  try {
    const parsedData = stockMovementsSchema.parse(req.body);
    const { prodottoId, daEntitaId, aEntitaId, quantita } = parsedData;

    // creo la connessione al db per fare una transazione
    const conn = await pool.getConnection();
    try {
      // verifico che la quantità sia sufficiente per fare il trasferimento
      const [rows] = await conn.query(
        "SELECT quantità FROM inventario WHERE prodotto_id = ? AND entita_id = ?",
        [prodottoId, daEntitaId]
      );
      if (!rows[0] || rows[0].quantità < quantita) {
        await conn.rollback();
        return res
          .status(400)
          .json({ errore: "Quantità insufficiente nella sede di origine" });
      }

      // comincio la transazione
      await conn.beginTransaction();

      // inserisco il record in movimenti
      await conn.query(
        buildInsertQuery("movimenti", [
          "prodotto_id",
          "da_entita_id",
          "a_entita_id",
          "quantità",
        ]),
        [prodottoId, daEntitaId, aEntitaId, quantita]
      );

      // rimuovo la quantità da entità di origine
      await conn.query(
        "UPDATE inventario SET quantità = quantità - ? WHERE prodotto_id = ? AND entita_id = ?",
        [quantita, prodottoId, daEntitaId]
      );

      // aggiungo la quantità all'entità di arrivo
      await conn.query(
        "INSERT INTO inventario(prodotto_id, entita_id, quantità) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE quantità = quantità + VALUES(quantità)",
        [prodottoId, aEntitaId, quantita]
      );

      // termino la transazione se andata a buon fine
      await conn.commit();

      res
        .status(201)
        .json({ messaggio: "movimento registrato ed inventario aggiornato" });
    } catch (error) {
      // annullo la transazione se ci sono stati errori
      await conn.rollback();
      handleServerError(
        res,
        error,
        "errore durante la registrazione dello spostamento merce"
      );
    } finally {
      // termino la connessione al db
      conn.release();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(res, error);
    }
    handleServerError(
      res,
      error,
      "errore durante la registrazione dello spostamento merce"
    );
  }
}
