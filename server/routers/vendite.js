import express from "express";
import {
  getAllVendite,
  getDettagliVendita,
  popolaSelectProdotti,
  popolaSelectStrutture,
  postVendita,
} from "../controller/controllerVendite.js";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";
import { dateFormatter } from "../middleware/dateFormatter.js";

const routerVendite = express.Router();

routerVendite.get("/", dateFormatter, getAllVendite);
routerVendite.get("/popolaStrutture", popolaSelectStrutture);
routerVendite.post("/", dateFormatter, postVendita);
routerVendite.get(
  "/popolaProdotti/:strutturaId",
  checkIdMiddleware,
  popolaSelectProdotti
);
routerVendite.get("/:id", checkIdMiddleware, getDettagliVendita);

export default routerVendite;
