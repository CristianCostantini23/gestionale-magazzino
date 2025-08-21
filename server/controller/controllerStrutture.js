import pool from "../db/db.js";
import { z } from "zod";
import { schemaStrutture } from "../schemas/schemaStrutture.js";
import {
  recordExistById,
  checkUniqueDuplicates,
} from "../utils/dataValidation.js";
import {
  buildInsertQuery,
  buildUpdateQuery,
  buildDeleteQuery,
  buildGetAllQuery,
  buildGetByIdQuery,
} from "../utils/queryBuilder.js";
import { handleControllerError } from "../utils/handleControllerError.js";

// GET ricevi tutte le strutture
export async function getAllStrutture(req, res) {
  try {
    const [rows] = await pool.query(buildGetAllQuery("strutture"));
    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}

// GET ricevi struttura per ID
export async function getStrutturaById(req, res) {
  const { id } = req.ids;

  try {
    const [rows] = await pool.query(buildGetByIdQuery("strutture"), [id]);
    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}

// POST aggungi una struttura
export async function postStruttura(req, res) {
  try {
    const parsedData = schemaStrutture.parse(req.body);
    const { nome, tipo, indirizzo } = parsedData;

    const duplicateFields = await checkUniqueDuplicates("strutture", {
      nome,
      indirizzo,
    });
    if (duplicateFields.length > 0) {
      return res.status(400).json({
        error: "ci sono valori duplicati",
        duplicates: duplicateFields,
      });
    }

    const query = buildInsertQuery("strutture", ["nome", "tipo", "indirizzo"]);
    const values = [nome, tipo, indirizzo];

    const [result] = await pool.query(query, values);
    res.status(201).json({ message: "struttura creata con successo" });
  } catch (error) {
    handleControllerError(error, res);
  }
}

// PUT aggiorna una struttura
export async function updateStruttura(req, res) {
  const { id } = req.ids;

  try {
    const rowExists = await recordExistById("strutture", id);
    if (!rowExists) {
      return res.status(404).json({ errore: "struttura non trovata" });
    }

    const parsedData = schemaStrutture.parse(req.body);
    const { nome, tipo, indirizzo } = parsedData;

    const duplicateFields = await checkUniqueDuplicates(
      "strutture",
      { nome, indirizzo },
      id
    );
    if (duplicateFields.length > 0) {
      return res.status(400).json({
        error: "ci sono valori duplicati",
        duplicates: duplicateFields,
      });
    }

    const query = buildUpdateQuery("strutture", ["nome", "tipo", "indirizzo"]);
    const values = [nome, tipo, indirizzo, id];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "struttura non trovata" });
    }

    res.status(200).json({ message: "struttura aggiornata con successo" });
  } catch (error) {
    handleControllerError(error, res);
  }
}

// DELETE rimuovi singola struttura
export async function deleteStruttura(req, res) {
  const { id } = req.ids;

  try {
    const rowExists = await recordExistById("strutture", id);
    if (!rowExists) {
      return res.status(404).json({ error: "struttura non trovata" });
    }

    const [hasinventario] = await pool.query(
      "SELECT * FROM inventari WHERE struttura_id = ?",
      [id]
    );

    if (hasinventario.length > 0) {
      return res
        .status(400)
        .json({
          error:
            "impossibile procedere con l'eliminazione. Ci sono prodotti ancora in inventario",
        });
    }

    const [result] = await pool.query(buildDeleteQuery("strutture"), [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "struttura non trovata" });
    }

    res.status(200).json({ message: "rimozione avvenuta con successo" });
  } catch (error) {
    handleControllerError(error, res);
  }
}
