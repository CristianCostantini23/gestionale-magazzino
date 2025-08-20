import express from "express";
import {
  popolaSelectFornitori,
  popolaSelectProdotti,
  popolaSelectStrutture,
} from "../controller/controllerSelect.js";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";

const routerPopola = express.Router();

routerPopola.get("/strutture", popolaSelectStrutture);
routerPopola.get("/fornitori", popolaSelectFornitori);
routerPopola.get(
  "/prodotti/:strutturaId",
  checkIdMiddleware,
  popolaSelectProdotti
);

export default routerPopola;
