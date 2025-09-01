import pool from "../db/db.js";
import { schemaMovimenti } from "../schemas/schemaMovimenti.js";
import { handleControllerError } from "../utils/handleControllerError.js";
import { recordExistById } from "../utils/dataValidation.js";
import { buildInsertQuery } from "../utils/queryBuilder.js";

// GET ricevi tutti i movimenti merce
export async function fetchAllMovimenti(req, res) {
  try {
    const [rows] = await pool.query(`
        SELECT 
            t.id AS trasferimento_id,
            so.nome AS struttura_origine,
            sd.nome AS struttura_destinazione,
            t.data_trasferimento,
            t.documento_riferimento,
            t.note
        FROM trasferimenti_merce t
        JOIN strutture so ON t.struttura_origine_id = so.id
        JOIN strutture sd ON t.struttura_destinazione_id = sd.id;
    `);

    if (!rows[0] || rows.length <= 0) {
      return res
        .status(404)
        .json({ error: "nessun dato relativo ai movimenti merce disponibile" });
    }

    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}

// GET ricevi dettaglio singolo movimento per ID
export async function getDettagliMovimentoById(req, res) {
  try {
    const { movimentoId } = req.ids;

    if (
      !(await recordExistById("trasferimento_merce_dettaglio", movimentoId))
    ) {
      return res.status(404).json({
        error: "impossibile trovare i dettagli relativi al movimento merce",
      });
    }

    const [rows] = await pool.query(
      `
        SELECT 
          t.id,
          p.nome AS nome_prodotto,
          p.codice,
          t.quantita
        FROM trasferimento_merce_dettaglio t
        JOIN prodotti p ON t.prodotto_id = p.id
        WHERE trasferimento_id = ? 
    `,
      [movimentoId]
    );

    const [intestazione] = await pool.query(
      `
      SELECT
        so.nome AS struttura_origine,
        sd.nome AS struttura_destinazione,
        t.data_trasferimento
      FROM trasferimenti_merce t
      JOIN strutture so ON t.struttura_origine = so.id
      JOIN strutture sd ON t.struttura_destinazione = sd.id
      WHERE t.id = ?;
    `,
      [movimentoId]
    );

    if (!rows[0] || rows.length <= 0) {
      return res
        .status(404)
        .json({ error: "impossibile trovare i dettagli del movimento merce" });
    }

    if (!intestazione[0]) {
      return res.status(404).json({ error: "intestazione non trovata" });
    }

    res.status(200).json({
      struttura_origine: intestazione[0].struttura_origine,
      struttura_destinazione: intestazione[0].struttura_destinazione,
      data_trasferimento: intestazione[0].data_trasferimento,
      prodotti: rows,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
}

// POST aggiungi movimento merce
export async function postMovimento(req, res) {
  try {
    const parsedData = schemaMovimenti.parse(req.body);
    const {
      strutturaOrigineId,
      strutturaDestinazioneId,
      dataTrasferimento,
      documentoRiferimento,
      note,
      prodotti,
    } = parsedData;

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [insertMovimenti] = await conn.query(
        buildInsertQuery("trasferimenti_merce", [
          "struttura_origine_id",
          "struttura_destinazione_id",
          "data_trasferimento",
          "documento_riferimento",
          "note",
        ]),
        [
          strutturaOrigineId,
          strutturaDestinazioneId,
          dataTrasferimento,
          documentoRiferimento,
          note,
        ]
      );

      const movimentoId = insertMovimenti.insertId;

      for (const prodotto of prodotti) {
        const { prodottoId, quantita } = prodotto;

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
          [prodottoId, strutturaOrigineId]
        );

        if (!stockRows[0] || stockRows[0].quantita < quantita) {
          await conn.rollback();
          return res.status(400).json({
            error: `Quantità insufficiente per il prodotto ${nomeProdotto}`,
          });
        }

        await conn.query(
          buildInsertQuery("trasferimento_merce_dettaglio", [
            "trasferimento_id",
            "prodotto_id",
            "quantita",
          ]),
          [movimentoId, prodottoId, quantita]
        );

        await conn.query(
          `
            UPDATE inventari SET quantita = quantita - ? WHERE prodotto_id = ? AND struttura_id = ?
        `,
          [quantita, prodottoId, strutturaOrigineId]
        );

        await conn.query(
          `
            INSERT INTO inventari (struttura_id, prodotto_id, quantita)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantita = quantita + VALUES(quantita)
        `,
          [strutturaDestinazioneId, prodottoId, quantita]
        );
      }

      await conn.commit();

      res.status(200).json({ message: "movimento registrato con successo" });
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
