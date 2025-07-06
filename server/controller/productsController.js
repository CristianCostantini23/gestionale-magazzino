import pool from "../db/db.js";
import { z } from "zod";
import { productSchema } from "../schemas/productSchema.js";

// seleziona tutti i prodotti
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

// inserisci nuovo prodotto
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
