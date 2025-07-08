import pool from "../db/db.js";
import { z } from "zod";
import { entitySchema } from "../schemas/entitySchema.js";
import {
  recordExistById,
  checkUniqueDuplicates,
  handleServerError,
  handleZodError,
} from "../utils/dataValidation.js";
import {
  buildInsertQuery,
  buildUpdateQuery,
  buildDeleteQuery,
  buildGetAllQuery,
} from "../utils/queryBuilder.js";

// GET ricevi tutte le entità
export async function getAllEntities(req, res) {
  try {
    const [rows] = await pool.query(buildGetAllQuery("entita"));
    res.status(200).json(rows);
  } catch (error) {
    handleServerError(res, error, "errore durante il caricamento delle entità");
  }
}

// POST aggungi una entità
export async function addEntity(req, res) {
  try {
    const parsedData = entitySchema.parse(req.body);
    const { nome, tipo, indirizzo } = parsedData;

    // verifico di non inserire duplicati su campi UNIQUE
    const duplicateFields = await checkUniqueDuplicates("entita", {
      nome,
      indirizzo,
    });
    if (duplicateFields.length > 0) {
      return res
        .status(400)
        .json({ errore: "valori duplicati", duplicati: duplicateFields });
    }

    const query = buildInsertQuery("entita", ["nome", "tipo", "indirizzo"]);
    const values = [nome, tipo, indirizzo];

    const [result] = await pool.query(query, values);
    res
      .status(201)
      .json({ messaggio: "entità creata", entityId: result.insertId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(res, error);
    }
    handleServerError(res, error, "errore durante la creazione del prodotto");
  }
}

// PUT aggiorna una entità
export async function updateEntity(req, res) {
  const { id } = req;

  try {
    // controllo se la riga esiste
    const rowExists = await recordExistById("entita", id);
    if (!rowExists) {
      return res.status(404).json({ errore: "entità non trovata" });
    }

    // validazione con ZOD
    const parsedData = entitySchema.parse(req.body);
    const { nome, tipo, indirizzo } = parsedData;

    // controllo unicità delle colonne UNIQUE
    const duplicateFields = await checkUniqueDuplicates(
      "entita",
      { nome, indirizzo },
      id
    );
    if (duplicateFields.length > 0) {
      return res
        .status(400)
        .json({ errore: "valori duplicati", duplicati: duplicateFields });
    }

    const query = buildUpdateQuery("entita", ["nome", "tipo", "indirizzo"]);
    const values = [nome, tipo, indirizzo, id];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ errore: "entità non trovata" });
    }

    res.status(200).json({ messaggio: "entità aggiornata con successo" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(res, error);
    }
    handleServerError(res, error, "errore durante l'aggiornamento dell'entità");
  }
}

// DELETE rimuovi singola entità
export async function deleteEntity(req, res) {
  const { id } = req;

  try {
    // controllo se la riga esiste
    const rowExists = await recordExistById("entita", id);
    if (!rowExists) {
      return res.status(404).json({ errore: "entità non trovata" });
    }

    const [result] = await pool.query(buildDeleteQuery("entita"), [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ errore: "entità non trovata" });
    }

    res.status(200).json({ messaggio: "rimozione avvenuta con successo" });
  } catch (error) {
    handleServerError(
      res,
      error,
      "errore durante la cancellazione dell'entità"
    );
  }
}
