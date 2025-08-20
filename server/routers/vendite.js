import express from "express";
import {
  getAllVendite,
  getDettagliVendita,
  postVendita,
} from "../controller/controllerVendite.js";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";
import { dateFormatter } from "../middleware/dateFormatter.js";
import { castToNumber } from "../middleware/castToNumber.js";

const routerVendite = express.Router();

routerVendite.get("/", dateFormatter, getAllVendite);
routerVendite.post(
  "/",
  castToNumber(["body"], {
    include: ["strutturaId", "prodottoId", "quantita", "prezzoUnitario"],
    deep: true,
    strictDecimal: true,
  }),
  dateFormatter,
  postVendita
);
routerVendite.get("/:id", checkIdMiddleware, getDettagliVendita);

export default routerVendite;
