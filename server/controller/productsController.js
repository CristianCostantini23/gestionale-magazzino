import pool from "../db/db.js";
import { z } from "zod";
import { productSchema } from "../schemas/productSchema.js";
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

// GET seleziona tutti i prodotti
export async function getAllProducts(req, res) {
  try {
    const [rows] = await pool.query(buildGetAllQuery("prodotti"));
    res.json(rows);
  } catch (error) {
    handleServerError(res, error, "Errore durante il caricamento dei prodotti");
  }
}

// GET seleziona prodotto per ID
export async function getProductById(req, res) {
  const { id } = req;

  try {
    const [rows] = await pool.query(buildGetByIdQuery("prodotti"), [id]);
    res.json(rows);
  } catch (error) {
    handleServerError(res, error, "Errore durante il caricamento dei prodotti");
  }
}

// POST inserisci nuovo prodotto
export async function addNewProduct(req, res) {
  try {
    const parsedData = productSchema.parse(req.body);
    const { nome, descrizione, brandId, prezzoAcquisto, prezzoVendita } =
      parsedData;

    // verifico di non inserire duplicati su campi UNIQUE
    const duplicateFields = await checkUniqueDuplicates("prodotti", { nome });
    if (duplicateFields.length > 0) {
      return res
        .status(400)
        .json({ errore: "valori duplicati", duplicati: duplicateFields });
    }

    const query = buildInsertQuery("prodotti", [
      "nome",
      "descrizione",
      "brand_id",
      "prezzo_acquisto",
      "prezzo_vendita",
    ]);

    const values = [nome, descrizione, brandId, prezzoAcquisto, prezzoVendita];

    const [result] = await pool.query(query, values);
    res
      .status(201)
      .json({ messaggio: "prodotto creato", productId: result.insertId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(res, error);
    }
    handleServerError(res, error, "errore durante la creazione del prodotto");
  }
}

// PUT mofifica un prodotto
export async function updateProduct(req, res) {
  const { id } = req;

  try {
    // controllo se la riga esiste
    const rowExists = await recordExistById("prodotti", id);
    if (!rowExists) {
      return res.status(404).json({ errore: "prodotto non trovato" });
    }

    // validazione con ZOD
    const parsedData = productSchema.parse(req.body);
    const { nome, descrizione, brandId, prezzoAcquisto, prezzoVendita } =
      parsedData;

    // controllo unicità dei campi UNIQUE
    const duplicateFields = await checkUniqueDuplicates(
      "prodotti",
      { nome },
      id
    );
    if (duplicateFields.length > 0) {
      return res
        .status(400)
        .json({ errore: "valori duplicati", duplicati: duplicateFields });
    }

    const query = buildUpdateQuery("prodotti", [
      "nome",
      "descrizione",
      "brand_id",
      "prezzo_acquisto",
      "prezzo_vendita",
    ]);

    const values = [
      nome,
      descrizione,
      brandId,
      prezzoAcquisto,
      prezzoVendita,
      id,
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ errore: "prodotto non trovato" });
    }

    res.status(200).json({ messaggio: "prodotto aggiornato con successo" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(res, error);
    }
    handleServerError(res, error, "errore durante l'aggiornamento dei dati");
  }
}

// DELETE elimina un prodotto
export async function deleteProduct(req, res) {
  const { id } = req;

  try {
    // controllo se la riga esiste
    const rowExists = await recordExistById("prodotti", id);
    if (!rowExists) {
      return res.status(404).json({ errore: "prodotto non trovato" });
    }

    const [result] = await pool.query(buildDeleteQuery("prodotti"), [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ errore: "prodotto non trovato" });
    }

    res.status(200).json({ messaggio: "rimozione avvenuta con successo" });
  } catch (error) {
    handleServerError(
      res,
      error,
      "errore durante la cancellazione del prodotto"
    );
  }
}
