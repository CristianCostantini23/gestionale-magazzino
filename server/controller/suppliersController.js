import pool from "../db/db.js";
import { z } from "zod";
import { suppliersSchema } from "../schemas/suppliersSchema.js";
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
  buildGetByIdQuery,
} from "../utils/queryBuilder.js";

// GET ricevi tutti i fornitori
export async function getAllSuppliers(req, res) {
  try {
    const [rows] = await pool.query(buildGetAllQuery("fornitori"));
    res.status(200).json(rows);
  } catch (error) {
    handleServerError(
      res,
      error,
      "errore durante il caricamento dei fornitori"
    );
  }
}

// GET ricevi fornitore per ID
export async function getSupplierById(req, res) {
  const { id } = req;

  try {
    const [rows] = await pool.query(buildGetByIdQuery("fornitori"), [id]);
    res.status(200).json(rows);
  } catch (error) {
    handleServerError(
      res,
      error,
      "errore durante il caricamento dei fornitori"
    );
  }
}

// POST aggungi un fornitore
export async function addSupplier(req, res) {
  console.log(req.body);

  try {
    const parsedData = suppliersSchema.parse(req.body);
    const { nome, telefono, email } = parsedData;

    // verifico di non inserire duplicati su campi UNIQUE
    const duplicateFields = await checkUniqueDuplicates("fornitori", {
      nome,
      telefono,
      email,
    });
    if (duplicateFields.length > 0) {
      return res
        .status(400)
        .json({ errore: "valori duplicati", duplicati: duplicateFields });
    }

    const query = buildInsertQuery("fornitori", ["nome", "telefono", "email"]);
    const values = [nome, telefono, email];

    const [result] = await pool.query(query, values);
    res
      .status(201)
      .json({ messaggio: "fornitore creato", entityId: result.insertId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(res, error);
    }
    handleServerError(res, error, "errore durante la creazione del fornitore");
  }
}

// PUT aggiorna un fornitore
export async function updateSuppliers(req, res) {
  const { id } = req;

  try {
    // controllo se la riga esiste
    const rowExists = await recordExistById("fornitori", id);
    if (!rowExists) {
      return res.status(404).json({ errore: "fornitore non trovato" });
    }

    // validazione con ZOD
    const parsedData = suppliersSchema.parse(req.body);
    const { nome, telefono, email } = parsedData;

    // controllo unicità delle colonne UNIQUE
    const duplicateFields = await checkUniqueDuplicates(
      "fornitori",
      { nome, telefono, email },
      id
    );
    if (duplicateFields.length > 0) {
      return res
        .status(400)
        .json({ errore: "valori duplicati", duplicati: duplicateFields });
    }

    const query = buildUpdateQuery("fornitori", ["nome", "telefono", "email"]);
    const values = [nome, telefono, email, id];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ errore: "fornitore non trovato" });
    }

    res.status(200).json({ messaggio: "fornitore aggiornato con successo" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(res, error);
    }
    handleServerError(
      res,
      error,
      "errore durante l'aggiornamento del fornitore"
    );
  }
}

// DELETE rimuovi singolo fornitore
export async function deleteSupplier(req, res) {
  const { id } = req;

  try {
    // controllo se la riga esiste
    const rowExists = await recordExistById("fornitori", id);
    if (!rowExists) {
      return res.status(404).json({ errore: "fornitore non trovato" });
    }

    const [result] = await pool.query(buildDeleteQuery("fornitori"), [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ errore: "fornitore non trovato" });
    }

    res.status(200).json({ messaggio: "rimozione avvenuta con successo" });
  } catch (error) {
    handleServerError(
      res,
      error,
      "errore durante la cancellazione del fornitore"
    );
  }
}
