import { handleControllerError } from "../utils/handleControllerError.js";
import pool from "../db/db.js";
import {
  buildGetAllQuery,
  buildGetByIdQuery,
  buildInsertQuery,
  buildUpdateQuery,
  buildDeleteQuery,
} from "../utils/queryBuilder.js";
import { schemaFornitori } from "../schemas/schemaFornitori.js";
import {
  checkUniqueDuplicates,
  recordExistById,
} from "../utils/dataValidation.js";

// GET ricevi tutti i fornitori
export async function getAllFornitori(req, res) {
  try {
    const [rows] = await pool.query(buildGetAllQuery("fornitori"));

    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}

// GET ricevi fornitore per ID
export async function getFornitoreById(req, res) {
  const { fornitoreId } = req.ids;

  try {
    const [rows] = await pool.query(buildGetByIdQuery("fornitori"), [
      fornitoreId,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}

// POST aggiungi un fornitore
export async function postFornitore(req, res) {
  try {
    const parsedData = schemaFornitori.parse(req.body);
    const { nome, cell, email } = parsedData;

    const duplicateFields = await checkUniqueDuplicates("fornitori", {
      nome,
      cell,
      email,
    });

    if (duplicateFields.length > 0) {
      return res.status(400).json({
        error: "ci sono valori duplicati",
        duplicates: duplicateFields,
      });
    }

    const query = buildInsertQuery("fornitori", ["nome", "cell", "email"]);
    const values = [nome, cell, email];

    const [result] = await pool.query(query, values);
    res.status(201).json({ message: "fornitore creato" });
  } catch (error) {
    handleControllerError(error, res);
  }
}

// PUT aggiorna fornitore
export async function updateFornitore(req, res) {
  const { fornitoreId } = req.ids;

  try {
    const rowExists = await recordExistById("fornitori", fornitoreId);
    if (!rowExists) {
      return res.status(404).json({ error: "fornitore non trovato" });
    }

    const parsedData = schemaFornitori.parse(req.body);
    const { nome, cell, email } = parsedData;

    const duplicateFields = await checkUniqueDuplicates(
      "fornitori",
      { nome, cell, email },
      fornitoreId
    );
    if (duplicateFields.length > 0) {
      return res.status(400).json({
        error: "ci sono valori duplicati",
        duplicates: duplicateFields,
      });
    }

    const query = buildUpdateQuery("fornitori", ["nome", "telefono", "email"]);
    const values = [nome, telefono, email, fornitoreId];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "fornitore non trovato" });
    }

    res.status(200).json({ message: "fornitore aggiornato con successo" });
  } catch (error) {
    handleControllerError(error, res);
  }
}

// DELETE rimuovi fornitore
export async function deleteFornitore(req, res) {
  const { fornitoreId } = req.ids;

  try {
    const rowExists = await recordExistById("fornitori", fornitoreId);
    if (!rowExists) {
      return res.status(404).json({ error: "fornitore non trovato" });
    }

    const [result] = await pool.query(buildDeleteQuery("fornitori"), [
      fornitoreId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "fornitore non trovato" });
    }

    res.status(200).json({ messaggio: "rimozione avvenuta con successo" });
  } catch (error) {
    handleControllerError(error, res);
  }
}
