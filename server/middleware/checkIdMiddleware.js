export function checkIdMiddleware(req, res, next) {
  const { id } = req.params;
  const idNumber = Number(id);
  if (!Number.isInteger(idNumber) || idNumber <= 0) {
    return res.status(400).json({ errore: "impossibile trovare ID" });
  }
  req.id = idNumber;
  next();
}
