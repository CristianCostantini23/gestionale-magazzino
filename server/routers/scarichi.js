import express from "express";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";
import { dateFormatter } from "../middleware/dateFormatter.js";
import {
  fetchAllScarichi,
  fetchDettagliScaricoById,
  postScarico,
} from "../controller/controllerScarichi.js";
import { castToNumber } from "../middleware/castToNumber.js";

const routerScarichi = express.Router();

routerScarichi.get("/", dateFormatter, fetchAllScarichi);
routerScarichi.post(
  "/",
  castToNumber(["body"], {
    include: [
      "strutturaId",
      "fornitoreId",
      "prodottoId",
      "quantita",
      "prezzoUnitario",
    ],
    deep: true,
    strictDecimal: true,
  }),
  dateFormatter,
  postScarico
);
routerScarichi.get(
  "/:scaricoId",
  checkIdMiddleware,
  dateFormatter,
  fetchDettagliScaricoById
);

export default routerScarichi;
