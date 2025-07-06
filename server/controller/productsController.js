import pool from "../db/db.js";

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
  const { nome, descrizione, brandId, prezzoAcquisto, prezzoVendita } =
    req.body;

  try {
    const query =
      "INSERT INTO prodotti(nome, descrizione, brand_id, prezzo_acquisto, prezzo_vendita) VALUES(?, ?, ?, ?, ?)";
    const values = [nome, descrizione, brandId, prezzoAcquisto, prezzoVendita];

    const [result] = await pool.query(query, values);
    res
      .status(201)
      .json({ messaggio: "prodotto creato", productId: result.insertId });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errore: "errore durante la creazione del prodotto" });
  }
}
