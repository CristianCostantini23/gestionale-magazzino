import { handleControllerError } from "../utils/handleControllerError.js";
import pool from "../db/db.js";

export async function getDatiGraficoHomepage(req, res) {
  try {
    const { period } = req.query;

    let query;
    if (period === "month") {
      query = `
        SELECT DATE(data_vendita) AS label,
               SUM(vp.quantita * vp.prezzo_unitario) AS totale
        FROM vendite v
        JOIN vendita_prodotto vp ON v.id = vp.vendita_id
        WHERE MONTH(data_vendita) = MONTH(CURRENT_DATE())
          AND YEAR(data_vendita) = YEAR(CURRENT_DATE())
        GROUP BY DATE(data_vendita)
        ORDER BY DATE(data_vendita);
      `;
    } else if (period === "quarter") {
      query = `
        SELECT CONCAT('Settimana ', WEEK(data_vendita, 1)) AS label,
               SUM(vp.quantita * vp.prezzo_unitario) AS totale
        FROM vendite v
        JOIN vendita_prodotto vp ON v.id = vp.vendita_id
        WHERE QUARTER(data_vendita) = QUARTER(CURRENT_DATE())
          AND YEAR(data_vendita) = YEAR(CURRENT_DATE())
        GROUP BY WEEK(data_vendita, 1)
        ORDER BY WEEK(data_vendita, 1);
      `;
    } else if (period === "year") {
      query = `
        SELECT CONCAT(MONTH(data_vendita), '/', YEAR(data_vendita)) AS label,
               SUM(vp.quantita * vp.prezzo_unitario) AS totale
        FROM vendite v
        JOIN vendita_prodotto vp ON v.id = vp.vendita_id
        WHERE YEAR(data_vendita) = YEAR(CURRENT_DATE())
        GROUP BY MONTH(data_vendita)
        ORDER BY MONTH(data_vendita);
      `;
    } else {
      return res.status(400).json({ message: "Periodo non valido" });
    }

    const [rows] = await pool.query(query);

    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}

export async function getUltimoScarico(req, res) {
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
        ORDER BY sc.data_scarico DESC, sc.id DESC
        LIMIT 1
    `);

    if (rows.length === 0 || !rows[0]) {
      return res.status(200).json({ message: "Non ci sono scarichi recenti" });
    }

    res.status(200).json({
      id: rows[0].scarico_id,
      struttura: rows[0].nome_struttura,
      data: rows[0].data_scarico,
      fornitore: rows[0].nome_fornitore,
      documento: rows[0].documento_riferimento,
      note: rows[0].note,
    });
  } catch (error) {
    console.error(error);
    handleControllerError(error, res);
  }
}

export async function getUltimoMovimento(req, res) {
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
        JOIN strutture sd ON t.struttura_destinazione_id = sd.id
        ORDER BY t.data_trasferimento DESC, t.id DESC
        LIMIT 1
    `);

    if (rows.length === 0 || !rows[0]) {
      return res.status(200).json({ message: "Non ci sono movimenti recenti" });
    }

    res.status(200).json({
      id: rows[0].trasferimento_id,
      struttura: `${rows[0].struttura_origine} -> ${rows[0].struttura_destinazione}`,
      data: rows[0].data_trasferimento,
      documento: rows[0].documento_riferimento,
      note: rows[0].note,
    });
  } catch (error) {
    console.error(error);
    handleControllerError(error, res);
  }
}
