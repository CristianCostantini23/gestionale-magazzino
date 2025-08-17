import express from "express";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";
import {
  getInventarioByStruttura,
  UpdateQuantitaInventario,
} from "../controller/controllerInventari.js";

const routerInventari = express.Router();

routerInventari.get(
  "/:strutturaId",
  checkIdMiddleware,
  getInventarioByStruttura
);
routerInventari.put(
  "/:strutturaId/:prodottoId",
  checkIdMiddleware,
  UpdateQuantitaInventario
);

export default routerInventari;
