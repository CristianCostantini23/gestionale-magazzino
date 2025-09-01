import pool from "../db/db.js";
import { handleControllerError } from "../utils/handleControllerError.js";
import { schemaScarichi } from "../schemas/schemaScarichi.js";
import { buildInsertQuery } from "../utils/queryBuilder.js";
import { recordExistById } from "../utils/dataValidation.js";

// GET ricevi lista di tutti gli scarichi
export async function fetchAllScarichi(req, res) {
  try {
    const [rows] = await pool.query(`
        SELECT
          sc.id AS scarico_id,
          st.nome AS nome_struttura,
          sc.data_scarico,
          f.nome AS nome_fornitore,
          sc.documento_riferimento,
          sc.note
        FROM scarichi_merce sc
        JOIN strutture st ON sc.struttura_id = st.id
        JOIN fornitori f ON sc.fornitore_id = f.id 
    `);

    if (!rows[0] || rows.length <= 0) {
      return res.status(404).json({
        error: "nessun dato relativo agli scarichi merce disponibile",
      });
    }

    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}

// GET ricevi dettagli di un singolo scarico
export async function fetchDettagliScaricoById(req, res) {
  try {
    const { scaricoId } = req.ids;

    if (!(await recordExistById("scarichi_merce", scaricoId))) {
      return res.status(404).json({
        error: "impossibile trovare i dettagli relativi allo scarico merce",
      });
    }

    const [rows] = await pool.query(
      `
        SELECT 
          s.id,
          p.nome AS nome_prodotto,
          p.codice,
          s.quantita,
          s.prezzo_unitario
        FROM scarico_merce_dettaglio s
        JOIN prodotti p ON s.prodotto_id = p.id
        WHERE scarico_id = ? 
    `,
      [scaricoId]
    );

    const [intestazione] = await pool.query(
      `
      SELECT 
       st.nome AS nome_struttura,
       s.data_scarico
      FROM scarichi_merce s
      JOIN strutture st ON s.struttura_id = st.id
      WHERE s.id = ?  
    `,
      [scaricoId]
    );

    if (!rows[0] || rows.length <= 0) {
      return res
        .status(404)
        .json({ error: "impossibile trovare i dettagli dello scarico merce" });
    }

    if (!intestazione[0]) {
      return res.status(404).json({ error: "intestazione non trovata" });
    }

    res.status(200).json({
      nome_struttura: intestazione[0].nome_struttura,
      data_scarico: intestazione[0].data_scarico,
      prodotti: rows,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
}

// POST aggiungi nuovo scarico
export async function postScarico(req, res) {
  try {
    const parsedData = schemaScarichi.parse(req.body);
    const {
      strutturaId,
      dataScarico,
      fornitoreId,
      documentoRiferimento,
      note,
      prodotti,
    } = parsedData;

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [insertScarico] = await conn.query(
        buildInsertQuery("scarichi_merce", [
          "struttura_id",
          "data_scarico",
          "fornitore_id",
          "documento_riferimento",
          "note",
        ]),
        [strutturaId, dataScarico, fornitoreId, documentoRiferimento, note]
      );

      const scaricoId = insertScarico.insertId;

      for (const prodotto of prodotti) {
        const { prodottoId, quantita, prezzoUnitario } = prodotto;

        await conn.query(
          buildInsertQuery("scarico_merce_dettaglio", [
            "scarico_id",
            "prodotto_id",
            "quantita",
            "prezzo_unitario",
          ]),
          [scaricoId, prodottoId, quantita, prezzoUnitario]
        );

        await conn.query(
          `
            INSERT INTO inventari (struttura_id, prodotto_id, quantita)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantita = quantita + VALUES(quantita)
        `,
          [strutturaId, prodottoId, quantita]
        );
      }

      await conn.commit();

      res.status(200).json({ message: "Scarico registrato con successo" });
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
