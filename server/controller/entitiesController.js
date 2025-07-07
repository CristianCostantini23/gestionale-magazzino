import pool from "../db/db.js";
import { z } from "zod";
import { entitySchema } from "../schemas/entitySchema.js";

// GET ricevi tutte le entità
export async function getAllEntities(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM entita");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errore: "errore durante il caricamento delle entità" });
  }
}

// POST aggungi una entità
export async function addEntity(req, res) {
  try {
    const parsedData = entitySchema.parse(req.body);
    const { nome, tipo, indirizzo } = parsedData;

    const query = "INSERT INTO entita(nome, tipo, indirizzo) VALUES (?, ?, ?);";
    const values = [nome, tipo, indirizzo];

    const [result] = await pool.query(query, values);
    res
      .status(201)
      .json({ messaggio: "entità creata", entityId: result.insertId });
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

// PUT aggiorna una entità
export async function updateEntity(req, res) {
  const { id } = req.params;
  const idNumber = Number(id);
  try {
    // controllo se id è valido
    if (!Number.isInteger(idNumber) || idNumber <= 0) {
      return res.status(400).json({ errore: "impossibile trovare ID" });
    }
    // controllo se la riga esiste
    const [existing] = await pool.query("SELECT id FROM entita WHERE id = ?", [
      idNumber,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ errore: "prodotto non trovato" });
    }

    // validazione con ZOD
    const parsedData = entitySchema.parse(req.body);
    const { nome, tipo, indirizzo } = parsedData;

    // controllo unicità del nome
    const [duplicates] = await pool.query(
      "SELECT id FROM entita WHERE nome = ? AND id != ?",
      [nome, idNumber]
    );
    if (duplicates.length > 0) {
      return res
        .status(400)
        .json({ errore: "esiste già un'entità con questo nome" });
    }
    const query = "UPDATE entita SET nome=?, tipo=?, indirizzo=? WHERE id = ?";
    const values = [nome, tipo, indirizzo, idNumber];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ errore: "entità non trovata" });
    }

    res.status(200).json({ messaggio: "entità aggiornata con successo" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ errore: "dati non validi", dettagli: error.errors });
    }
    console.error(error);
    res
      .status(500)
      .json({ errore: "errore durante l'aggiornamento dell'entità" });
  }
}

// DELETE rimuovi singola entità
export async function deleteEntity(req, res) {
  const { id } = req.params;
  const idNumber = Number(id);

  // verifico se ID è valido
  if (!Number.isInteger(idNumber) || idNumber <= 0) {
    return res.status(400).json({ errore: "impossibile trovare ID" });
  }
  try {
    const [result] = await pool.query("DELETE FROM entita WHERE id = ?", [
      idNumber,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ errore: "entità non trovata" });
    }

    res.status(200).json({ messaggio: "rimozione avvenuta con successo" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errore: "errore durante la cancellazione dell'entità" });
  }
}
