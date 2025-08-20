import pool from "../db/db.js";
import { handleControllerError } from "../utils/handleControllerError.js";

// GET ricevi strutture per popolare select
export async function popolaSelectStrutture(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT id, nome FROM strutture   
    `);

    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}

// GET ricevi prodotti per popolare select vendite e movimenti
export async function popolaSelectProdotti(req, res) {
  try {
    const { strutturaId } = req.ids;

    const [rows] = await pool.query(
      `
      SELECT 
        p.id, 
        p.nome, 
        i.quantita 
      FROM inventari i
      JOIN prodotti p ON p.id = i.prodotto_id
      WHERE i.struttura_id = ?
      `,
      [strutturaId]
    );

    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}

// GET ricevi fornitori per popolare select
export async function popolaSelectFornitori(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT id, nome FROM fornitori   
    `);

    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}
