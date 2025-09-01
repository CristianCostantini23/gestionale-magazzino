export const dateFormatter = (req, res, next) => {
  if (req.body) {
    const formatInputDate = (dateStr) => {
      if (!dateStr) return null;

      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }

      if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
      }

      return null;
    };

    if (req.body.dataScarico) {
      req.body.dataScarico = formatInputDate(req.body.dataScarico);
    }
    if (req.body.dataVendita) {
      req.body.dataVendita = formatInputDate(req.body.dataVendita);
    }
    if (req.body.dataTrasferimento) {
      req.body.dataTrasferimento = formatInputDate(req.body.dataTrasferimento);
    }
  }

  const oldJson = res.json;
  res.json = function (data) {
    const formatOutputDate = (dateStr) => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      if (isNaN(d)) return null;

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const traverse = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(traverse);
      } else if (obj !== null && typeof obj === "object") {
        const newObj = {};
        for (const key in obj) {
          if (key.toLowerCase().includes("data")) {
            newObj[key] = formatOutputDate(obj[key]);
          } else {
            newObj[key] = traverse(obj[key]);
          }
        }
        return newObj;
      }
      return obj;
    };

    return oldJson.call(this, traverse(data));
  };

  next();
};
