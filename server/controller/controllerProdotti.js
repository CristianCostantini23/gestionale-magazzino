import pool from "../db/db.js";
import { schemaProdotti } from "../schemas/schemaProdotti.js";
import {
  checkUniqueDuplicates,
  recordExistById,
} from "../utils/dataValidation.js";
import { handleControllerError } from "../utils/handleControllerError.js";
import {
  buildDeleteQuery,
  buildGetAllQuery,
  buildInsertQuery,
  buildUpdateQuery,
} from "../utils/queryBuilder.js";

// GET ricevi tutti i prodotti
export async function fetchAllProdotti(req, res) {
  try {
    const [rows] = await pool.query(buildGetAllQuery("prodotti"));

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Nessun dato relativo ai prodotti" });
    }

    res.status(200).json(rows);
  } catch (error) {
    handleControllerError(error, res);
  }
}

// POST aggiungi nuovo prodotto
export async function postProdotto(req, res) {
  try {
    const parsedData = schemaProdotti.parse(req.body);
    const { nome, descrizione, codice, prezzo_vendita } = parsedData;

    const duplicateFields = await checkUniqueDuplicates("prodotti", {
      nome,
      codice,
    });

    if (duplicateFields.length > 0) {
      return res.status(400).json({
        error: "ci sono valori duplicati",
        duplicates: duplicateFields,
      });
    }

    const query = buildInsertQuery("prodotti", [
      "nome",
      "descrizione",
      "codice",
      "prezzo_vendita",
    ]);
    const values = [nome, descrizione, codice, prezzo_vendita];

    const [result] = await pool.query(query, values);

    res.status(200).json({ message: "prodotto aggiunto con successo" });
  } catch (error) {
    handleControllerError(error, res);
  }
}

// PUT aggiorna un prodotto
export async function updateProdotto(req, res) {
  try {
    const { prodottoId } = req.ids;

    const rowExists = await recordExistById("prodotti", prodottoId);
    if (!rowExists) {
      return res.status(404).json({ error: "prodotto non trovato" });
    }

    const parsedData = schemaProdotti.parse(req.body);
    const { nome, descrizione, codice, prezzo_vendita } = parsedData;

    const duplicateFields = await checkUniqueDuplicates(
      "prodotti",
      {
        nome,
        codice,
      },
      prodottoId
    );

    if (duplicateFields.length > 0) {
      return res.status(400).json({
        error: "ci sono valori duplicati",
        duplicates: duplicateFields,
      });
    }

    const query = buildUpdateQuery("prodotti", [
      "nome",
      "descrizione",
      "codice",
      "prezzo_vendita",
    ]);

    const values = [nome, descrizione, codice, prezzo_vendita, prodottoId];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "prodotto non trovato" });
    }

    res.status(200).json({ message: "prodotto aggiornato con successo" });
  } catch (error) {
    handleControllerError(error, res);
  }
}

// DELETE elimina un prodotto
export async function deleteProdotto(req, res) {
  try {
    const { prodottoId } = req.ids;

    const rowExists = await recordExistById("prodotti", prodottoId);
    if (!rowExists) {
      return res.status(404).json({ error: "prodotto non trovato" });
    }

    const [result] = await pool.query(buildDeleteQuery("prodotti"), [
      prodottoId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "prodotto non trovato" });
    }

    res.status(200).json({ messaggio: "rimozione avvenuta con successo" });
  } catch (error) {
    handleControllerError(error, res);
  }
}
