import express from "express";
import {
  fetchAllMovimenti,
  getDettagliMovimentoById,
  postMovimento,
} from "../controller/controllerMovimenti.js";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";
import { dateFormatter } from "../middleware/dateFormatter.js";

const routerMovimenti = express.Router();

routerMovimenti.get("/", dateFormatter, fetchAllMovimenti);
routerMovimenti.post("/", dateFormatter, postMovimento);
routerMovimenti.get(
  "/:movimentoId",
  checkIdMiddleware,
  getDettagliMovimentoById
);

export default routerMovimenti;
