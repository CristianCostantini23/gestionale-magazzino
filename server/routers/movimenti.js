import express from "express";
import {
  fetchAllMovimenti,
  getDettagliMovimentoById,
  postMovimento,
} from "../controller/controllerMovimenti.js";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";
import { dateFormatter } from "../middleware/dateFormatter.js";
import { castToNumber } from "../middleware/castToNumber.js";

const routerMovimenti = express.Router();

routerMovimenti.get("/", dateFormatter, fetchAllMovimenti);
routerMovimenti.post(
  "/",
  castToNumber(["body"], {
    include: ["strutturaId", "prodottoId", "quantita", "prezzoUnitario"],
    deep: true,
    strictDecimal: true,
  }),
  dateFormatter,
  postMovimento
);
routerMovimenti.get(
  "/:movimentoId",
  checkIdMiddleware,
  getDettagliMovimentoById
);

export default routerMovimenti;
