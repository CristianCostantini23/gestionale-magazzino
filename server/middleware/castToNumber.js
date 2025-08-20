export function castToNumber(
  sources = ["body"],
  {
    include = null, // array di campi da convertire (prioritario)
    exclude = [], // campi da saltare
    deep = false, // converte anche in oggetti/array annidati
    strictDecimal = false, // consenti solo numeri decimali semplici (niente "1e3", "0x10")
  } = {}
) {
  const isPlainDecimal = (s) =>
    typeof s === "string" && /^[+-]?\d+(\.\d+)?$/.test(s.trim());

  const tryCast = (val) => {
    if (val === "" || val === null || val === undefined) return val;
    if (typeof val === "string") {
      if (strictDecimal && !isPlainDecimal(val)) return val;
      const n = Number(val);
      return Number.isFinite(n) ? n : val;
    }
    return val;
  };

  const walk = (obj) => {
    if (Array.isArray(obj)) return obj.map(walk);
    if (obj && typeof obj === "object") {
      Object.keys(obj).forEach((k) => {
        if (exclude.includes(k)) return;

        if (include && !include.includes(k)) {
          if (deep && typeof obj[k] === "object") obj[k] = walk(obj[k]);
          return;
        }

        if (deep && typeof obj[k] === "object") {
          obj[k] = walk(obj[k]);
        } else {
          obj[k] = tryCast(obj[k]);
        }
      });
    }
    return obj;
  };

  return (req, res, next) => {
    sources.forEach((source) => {
      if (!req[source]) return;
      if (deep) {
        req[source] = walk(req[source]);
      } else {
        Object.keys(req[source]).forEach((key) => {
          if (exclude.includes(key)) return;
          if (include && !include.includes(key)) return;
          req[source][key] = tryCast(req[source][key]);
        });
      }
    });
    next();
  };
}
