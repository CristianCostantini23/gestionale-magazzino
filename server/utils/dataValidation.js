import pool from "../db/db.js";

// verifico se una riga esiste
// ritorna true se esiste, altrimenti false
export async function recordExistById(table, id) {
  const [rows] = await pool.query("SELECT id FROM ?? WHERE id = ?", [
    table,
    id,
  ]);
  return rows.length > 0;
}

// controlla se sono presenti duplicati su campi UNIQUE di altre righe
// utilizzabile sia per le INSERT che UPDATE
// ritorna array vuoto se non ci sono duplicati oppure un array con i duplicati
// table = stringa nome tabella; fields = oggetto nome_colonna: valore; excludedId = id da escludere per update
export async function checkUniqueDuplicates(table, fields, excludedId = null) {
  const duplicatesFields = [];

  for (const [field, value] of Object.entries(fields)) {
    const query = excludedId
      ? `SELECT id FROM \`${table}\` WHERE \`${field}\` = ? AND id != ?`
      : `SELECT id FROM \`${table}\` WHERE \`${field}\` = ?`;
    const params = excludedId ? [value, excludedId] : [value];

    const [rows] = await pool.query(query, params);

    if (rows.length > 0) {
      duplicatesFields.push(field);
    }
  }
  return duplicatesFields;
}

// gestisce gli errori interni (status 500) da usare nel blocco catch
// ritorna la risposta con errore
export function handleServerError(
  res,
  error,
  errMessage = "errore interno del server"
) {
  console.error(error);
  res.status(500).json({ errore: errMessage });
}

// gestisce gli errori ZOD
// ritorna la risposta con errore
export function handleZodError(res, error) {
  return res
    .status(400)
    .json({ errore: "dati non validi", dettaglio: error.errors });
}
