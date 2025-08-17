export function checkIdMiddleware(req, res, next) {
  const ids = {};

  for (const [key, value] of Object.entries(req.params)) {
    const num = Number(value);
    if (!Number.isInteger(num) || num <= 0) {
      return res.status(400).json({ errore: "ID non valido" });
    }
    ids[key] = num; // esempio: { strutturaId: 1, prodottoId: 5 }
  }

  req.ids = ids;
  next();
}
