import pool from "../db/db.js";
import { z } from "zod";
import { incomingStockSchema } from "../schemas/incomingStockSchema.js";
import { handleServerError, handleZodError } from "../utils/dataValidation.js";
import { buildInsertQuery } from "../utils/queryBuilder.js";

// POST inserisco un nuovo scarico merce
export async function createIncomingStock(req, res) {
  try {
    const parsedData = incomingStockSchema.parse(req.body);
    const {
      fornitoreId,
      prodottoId,
      entitaId,
      quantita,
      prezzoAcquisto,
      prezzoVendita,
    } = parsedData;

    // creo la connessione al db per fare una transazione
    const conn = await pool.getConnection();
    try {
      // comincio la transazione
      await conn.beginTransaction();

      // inserico il record in merce_scaricata
      await conn.query(
        buildInsertQuery("merce_scaricata", [
          "fornitore_id",
          "prodotto_id",
          "entita_id",
          "quantità",
          "prezzo_acquisto",
          "prezzo_vendita",
        ]),
        [
          fornitoreId,
          prodottoId,
          entitaId,
          quantita,
          prezzoAcquisto,
          prezzoVendita,
        ]
      );

      // aggiorna invetario (inserisci nuova o incrementa)
      await conn.query(
        `INSERT INTO inventario (prodotto_id, entita_id, quantità)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE quantità = quantità + VALUES(quantità)`,
        [prodottoId, entitaId, quantita]
      );

      // aggiorno i prezzo di acquisto e vendita in prodotti
      await conn.query(
        "UPDATE prodotti SET prezzo_acquisto = ?, prezzo_vendita = ? WHERE id = ?",
        [prezzoAcquisto, prezzoVendita, prodottoId]
      );

      // termino la transazione se andata a buon fine
      await conn.commit();

      res
        .status(201)
        .json({ messaggio: "scarico registrato ed inventario aggiornato" });
    } catch (error) {
      // annullo la transazione se qualcosa va storto
      await conn.rollback();

      handleServerError(
        res,
        error,
        "Errore durante la registrazione dello scarico"
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(res, error);
    }
    handleServerError(
      res,
      error,
      "errore durante la registrazione della merce in entrata"
    );
  }
}
