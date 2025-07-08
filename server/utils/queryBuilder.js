// crea la query per insert
// la passo come primo argomento di pool.query e come secondo arg passo array di valori
export function buildInsertQuery(tableName, fields) {
  const placeHolders = fields.map(() => "?").join(", ");
  return `INSERT INTO \`${tableName}\`(${fields.join(
    ", "
  )}) VALUES (${placeHolders})`;
}

// crea la query per update
// la passo come primo argomento di pool.query e come secondo arg passo array di valori
export function buildUpdateQuery(tableName, fields) {
  const valuesToUpdate = fields.map((field) => `${field} = ?`).join(", ");
  return `UPDATE \`${tableName}\` SET ${valuesToUpdate} WHERE id = ?`;
}
