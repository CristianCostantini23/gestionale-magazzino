import pool from "../db/db.js";
import { schemaVendite } from "../schemas/schemaVendite.js";
import { recordExistById } from "../utils/dataValidation.js";
import { handleControllerError } from "../utils/handleControllerError.js";
import { buildInsertQuery } from "../utils/queryBuilder.js";

// POST registro una nuova vendita
export async function postVendita(req, res) {
  try {
    const parsedData = schemaVendite.parse(req.body);
    const { strutturaId, prodotti, dataVendita } = parsedData;

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [saleResult] = await conn.query(
        buildInsertQuery("vendite", ["struttura_id", "data_vendita"]),
        [strutturaId, dataVendita]
      );

      const venditaId = saleResult.insertId;

      for (const prodotto of prodotti) {
        const { prodottoId, quantita, prezzoUnitario } = prodotto;

        const [prodottiRows] = await conn.query(
          "SELECT nome FROM prodotti WHERE id = ?",
          [prodottoId]
        );

        const nomeProdotto = prodottiRows[0]?.nome;

        if (quantita <= 0) {
          await conn.rollback();
          return res.status(400).json({
            error: `La quantità per il prodotto ${nomeProdotto} deve essere maggiore di zero`,
          });
        }

        const [stockRows] = await conn.query(
          "SELECT quantita FROM inventari WHERE prodotto_id = ? AND struttura_id = ?",
          [prodottoId, strutturaId]
        );

        if (!stockRows[0] || stockRows[0].quantita < quantita) {
          await conn.rollback();
          return res.status(400).json({
            error: `Quantità insufficiente per il prodotto ${nomeProdotto}`,
          });
        }

        await conn.query(
          buildInsertQuery("vendita_prodotto", [
            "vendita_id",
            "prodotto_id",
            "quantita",
            "prezzo_unitario",
          ]),
          [venditaId, prodottoId, quantita, prezzoUnitario]
        );

        await conn.query(
          "UPDATE inventari SET quantita = quantita - ? WHERE prodotto_id = ? AND struttura_id = ?",
          [quantita, prodottoId, strutturaId]
        );
      }

      await conn.commit();

      res.status(200).json({ message: "vendita registrata con successo" });
    } catch (error) {
      await conn.rollback();
      handleControllerError(error, res);
    } finally {
      conn.release();
    }
  } catch (error) {
    handleControllerError(error, res);
  }
}

// GET ricevo i dettagli di una singola vendita per ID
export async function getDettagliVendita(req, res) {
  try {
    const { venditaId } = req.ids;

    if (!(await recordExistById("vendita_prodotto", venditaId))) {
      return res.status(404).json({
        error: "impossibile trovare i dettagli relativi alla vendita",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT 
        p.nome AS nome_prodotto,
        p.codice,
        vp.quantita,
        vp.prezzo_unitario
      FROM vendita_prodotto vp
      JOIN prodotti p ON vp.prodotto_id = p.id
      WHERE vp.vendita_id = ?
    `,
      [venditaId]
    );

    const [intestazione] = await pool.query(
      `
        SELECT
         s.nome AS nome_struttura,
         v.data_vendita
        FROM vendite v
        JOIN strutture s ON v.struttura_id = s.id
        WHERE v.id = ?
      `,
      [venditaId]
    );

    if (!rows[0] || rows.length <= 0) {
      return res
        .status(404)
        .json({ error: "impossibile trovare i dettagli della vendita" });
    }

    if (!intestazione[0]) {
      return res.status(404).json({ error: "intestazione non trovata" });
    }

    res.status(200).json({
      nome_struttura: intestazione[0].nome_struttura,
      data_vendita: intestazione[0].data_vendita,
      prodotti: rows,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
}

// GET tutte le vendite
export async function getAllVendite(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        v.id,
        s.nome AS nome_struttura,
        v.data_vendita,
        SUM(vp.quantita * vp.prezzo_unitario) AS totale
      FROM vendite v
      JOIN strutture s ON v.struttura_id = s.id
      JOIN vendita_prodotto vp ON v.id = vp.vendita_id
      GROUP BY v.id, s.nome, v.data_vendita
      ORDER BY v.data_vendita DESC
    `);

    if (!rows[0] || rows.length <= 0) {
      return res
        .status(404)
        .json({ error: "nessun dato relativo alle vendite disponibile" });
    }

    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}

// GET lista dettagliata di tutte le vendite
export async function getAllDettagliVendite(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        v.id AS id,
        v.id AS vendita_id,
        s.nome AS struttura,
        p.nome AS prodotto,
        vp.quantita,
        vp.prezzo_unitario,
        v.data_vendita
      FROM vendite v
      JOIN strutture s ON v.struttura_id = s.id
      JOIN vendita_prodotto vp ON v.id = vp.vendita_id
      JOIN prodotti p ON vp.prodotto_id = p.id
      ORDER BY v.data_vendita DESC, v.id
    `);

    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}
