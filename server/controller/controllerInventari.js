import { handleControllerError } from "../utils/handleControllerError.js";
import pool from "../db/db.js";

export async function getInventarioByStruttura(req, res) {
  try {
    const { strutturaId } = req.ids;

    const [strutturaRows] = await pool.query(
      `SELECT * FROM strutture WHERE id = ?`,
      [strutturaId]
    );

    const nomeStruttura = strutturaRows[0]?.nome;
    const tipoStruttura = strutturaRows[0]?.tipo;
    const indirizzoStruttura = strutturaRows[0]?.indirizzo;

    const [rows] = await pool.query(
      ` SELECT i.id AS inventario_id, p.nome AS nome_prodotto, p.descrizione, p.codice, i.quantita
        FROM inventari i
        JOIN prodotti p ON p.id = i.prodotto_id
        WHERE i.struttura_id = ?`,
      [strutturaId]
    );

    if (rows.length === 0) {
      return res.status(200).json({
        nomeStruttura,
        tipoStruttura,
        indirizzoStruttura,
        inventario: [],
      });
    }

    res.status(200).json({
      nomeStruttura,
      tipoStruttura,
      indirizzoStruttura,
      inventario: rows,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
}

export async function UpdateQuantitaInventario(req, res) {
  try {
    const { prodottoId } = req.ids;
    const { nuovaQuantita } = req.body;

    if (!Number.isInteger(nuovaQuantita) || nuovaQuantita < 0) {
      return res.status(400).json({ errore: "Quantità non valida" });
    }

    const [result] = await pool.query(
      "UPDATE inventari SET quantita = ? WHERE prodotto_id = ?",
      [nuovaQuantita, prodottoId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ errore: "Nessun inventario trovato per questo prodotto" });
    }

    res.status(200).json({ message: "quantità aggiornata con successo" });
  } catch (error) {
    handleControllerError(error, res);
  }
}
