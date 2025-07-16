import pool from "../db/db.js";
import { z } from "zod";
import { incomingStockSchema } from "../schemas/incomingStockSchema.js";
import { handleServerError, handleZodError } from "../utils/dataValidation.js";
import { buildInsertQuery } from "../utils/queryBuilder.js";

// GET ricevo lo storico degli scarichi merce
export async function getAllInconmingStock(req, res) {
  try {
    const [result] = await pool.query(`SELECT 
    ms.id,
    f.nome AS nome_fornitore,
    p.nome AS nome_prodotto,
    e.nome AS nome_entita,
    ms.quantità,
    ms.prezzo_acquisto,
    ms.prezzo_vendita,
    ms.data_arrivo
    FROM merce_scaricata ms
    JOIN fornitori f ON ms.fornitore_id = f.id
    JOIN prodotti p ON ms.prodotto_id = p.id
    JOIN entita e ON ms.entita_id = e.id;`);

    res.status(200).json(result);
  } catch (error) {
    handleServerError(
      res,
      error,
      "errore durante il recupero dello storico scarichi"
    );
  }
}

// GET scarico merce per ID
export async function getIncomingStockById(req, res) {
  const { id } = req;

  try {
    const [result] = await pool.query(
      `SELECT ms.id,
    f.nome AS nome_fornitore,
    p.nome AS nome_prodotto,
    e.nome AS nome_entita,
    ms.quantità,
    ms.prezzo_acquisto,
    ms.prezzo_vendita,
    ms.data_arrivo
    FROM merce_scaricata ms
    JOIN fornitori f ON ms.fornitore_id = f.id
    JOIN prodotti p ON ms.prodotto_id = p.id
    JOIN entita e ON ms.entita_id = e.id
    WHERE ms.id = ?`,
      [id]
    );

    if (!result[0]) {
      return res
        .status(400)
        .json({ errore: "impossibile trovare lo scarico merce desiderato" });
    }

    res.status(200).json(result);
  } catch (error) {
    handleServerError(
      res,
      error,
      "errore durante il recupero dei dati relativo allo scarico merce"
    );
  }
}

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
