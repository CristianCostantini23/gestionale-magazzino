import pool from "../db/db.js";
import { z } from "zod";
import { productSchema } from "../schemas/productSchema.js";

// GET seleziona tutti i prodotti
export async function getAllProducts(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM prodotti");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore durante il caricamento dei prodotti" });
  }
}

// POST inserisci nuovo prodotto
export async function addNewProduct(req, res) {
  try {
    const parsedData = productSchema.parse(req.body);
    const { nome, descrizione, brandId, prezzoAcquisto, prezzoVendita } =
      parsedData;

    const query =
      "INSERT INTO prodotti(nome, descrizione, brand_id, prezzo_acquisto, prezzo_vendita) VALUES(?, ?, ?, ?, ?)";
    const values = [nome, descrizione, brandId, prezzoAcquisto, prezzoVendita];

    const [result] = await pool.query(query, values);
    res
      .status(201)
      .json({ messaggio: "prodotto creato", productId: result.insertId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ errore: "dati non validi", dettagli: error.errors });
    }
    console.error(error);
    res
      .status(500)
      .json({ errore: "errore durante la creazione del prodotto" });
  }
}

// PUT mofifica un prodotto
export async function updateProduct(req, res) {
  const { id } = req.params;
  const idNumber = Number(id);

  // controllo se id è valido
  if (!Number.isInteger(idNumber) || idNumber <= 0) {
    return res.status(400).json({ errore: "impossibile trovare ID" });
  }

  try {
    // controllo se la riga esiste
    const [existing] = await pool.query(
      "SELECT id FROM prodotti WHERE id = ?",
      [idNumber]
    );
    if (existing.length === 0) {
      return res.status(404).json({ errore: "prodotto non trovato" });
    }

    // validazione con ZOD
    const parsedData = productSchema.parse(req.body);
    const { nome, descrizione, brandId, prezzoAcquisto, prezzoVendita } =
      parsedData;

    // controllo unicità del nome prodotto
    const [duplicates] = await pool.query(
      "SELECT id FROM prodotti WHERE nome = ? AND id != ?",
      [nome, idNumber]
    );
    if (duplicates.length > 0) {
      return res
        .status(400)
        .json({ errore: "esiste già un prodotto con questo nome" });
    }

    const query =
      "UPDATE prodotti SET nome = ?, descrizione = ?, brand_id = ?, prezzo_acquisto = ?, prezzo_vendita = ? WHERE id = ?";
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
      return res
        .status(400)
        .json({ errore: "dati non validi", dettagli: error.errors });
    }
    console.error(error);
    res.status(500).json({ errore: "errore durante l'aggiornamento dei dati" });
  }
}
