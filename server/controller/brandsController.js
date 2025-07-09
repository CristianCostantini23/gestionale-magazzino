import pool from "../db/db.js";
import { z } from "zod";
import { brandsSchema } from "../schemas/brandsSchema.js";
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

// GET ricevi tutti i brands
export async function getAllBrands(req, res) {
  try {
    const [rows] = await pool.query(buildGetAllQuery("brands"));
    res.status(200).json(rows);
  } catch (error) {
    handleServerError(res, error, "errore durante il caricamento dei brands");
  }
}

// GET ricevi brand per id
export async function getBrandById(req, res) {
  const { id } = req;

  try {
    const [rows] = await pool.query(buildGetByIdQuery("brands"), [id]);
    res.status(200).json(rows);
  } catch (error) {
    handleServerError(res, error, "errore durante il caricamento del brand");
  }
}

// POST aggungi un brand
export async function addBrand(req, res) {
  try {
    const parsedData = brandsSchema.parse(req.body);
    const { nome } = parsedData;

    // verifico di non inserire duplicati su campi UNIQUE
    const duplicateFields = await checkUniqueDuplicates("brands", {
      nome,
    });
    if (duplicateFields.length > 0) {
      return res
        .status(400)
        .json({ errore: "valori duplicati", duplicati: duplicateFields });
    }

    const query = buildInsertQuery("brands", ["nome"]);
    const values = [nome];

    const [result] = await pool.query(query, values);
    res
      .status(201)
      .json({ messaggio: "brand creato", entityId: result.insertId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(res, error);
    }
    handleServerError(res, error, "errore durante la creazione del brand");
  }
}

// PUT aggiorna un brand
export async function updatebrand(req, res) {
  const { id } = req;

  try {
    // controllo se la riga esiste
    const rowExists = await recordExistById("brands", id);
    if (!rowExists) {
      return res.status(404).json({ errore: "brand non trovato" });
    }

    // validazione con ZOD
    const parsedData = brandsSchema.parse(req.body);
    const { nome } = parsedData;

    // controllo unicità delle colonne UNIQUE
    const duplicateFields = await checkUniqueDuplicates("brands", { nome }, id);
    if (duplicateFields.length > 0) {
      return res
        .status(400)
        .json({ errore: "valori duplicati", duplicati: duplicateFields });
    }

    const query = buildUpdateQuery("brands", ["nome"]);
    const values = [nome, id];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ errore: "brand non trovato" });
    }

    res.status(200).json({ messaggio: "brand aggiornato con successo" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(res, error);
    }
    handleServerError(res, error, "errore durante l'aggiornamento del brand");
  }
}

// DELETE rimuovi singolo brand
export async function deleteBrand(req, res) {
  const { id } = req;

  try {
    // controllo se la riga esiste
    const rowExists = await recordExistById("brands", id);
    if (!rowExists) {
      return res.status(404).json({ errore: "brand non trovato" });
    }

    // controllo che il brand non sia associato a prodotti esisntenti nella tabella prodotti
    const [prodotti] = await pool.query(
      "SELECT * FROM prodotti WHERE brand_id = ?",
      [id]
    );

    if (prodotti.length > 0) {
      return res.status(400).json({
        message: "Impossibile eliminare il brand: ci sono prodotti associati.",
      });
    }

    const [result] = await pool.query(buildDeleteQuery("brands"), [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ errore: "brand non trovato" });
    }

    res.status(200).json({ messaggio: "rimozione avvenuta con successo" });
  } catch (error) {
    handleServerError(res, error, "errore durante la cancellazione del brand");
  }
}
