// query per GET ALL
// prende il nome della tabella
// la passo come primo argomento di pool.query
export function buildGetAllQuery(tableName) {
  return `SELECT * FROM \`${tableName}\``;
}

// query per get by ID
// prende il nome della tabella
// la passo come primo argomento di pool.query e come secondo l'id del record
export function buildGetByIdQuery(tableName) {
  return `SELECT * FROM \`${tableName}\` WHERE id = ?`;
}

//  query per insert
// prende il nome della tabella ed array dei campi per insert
// la passo come primo argomento di pool.query e come secondo arg passo array di valori
export function buildInsertQuery(tableName, fields) {
  const placeHolders = fields.map(() => "?").join(", ");
  return `INSERT INTO \`${tableName}\`(${fields.join(
    ", "
  )}) VALUES (${placeHolders})`;
}

//  query per update
// prende il nome della tabella ed array dei campi per update
// la passo come primo argomento di pool.query e come secondo arg passo array di valori
export function buildUpdateQuery(tableName, fields) {
  const valuesToUpdate = fields.map((field) => `${field} = ?`).join(", ");
  return `UPDATE \`${tableName}\` SET ${valuesToUpdate} WHERE id = ?`;
}

// query per delete
// prende il nome della tabella ed id della riga da cancellare
// la passo come primo argomento di pool.query
export function buildDeleteQuery(tableName) {
  return `DELETE FROM \`${tableName}\` WHERE id = ?`;
}
