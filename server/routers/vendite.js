import express from "express";
import {
  getAllVendite,
  getDettagliVendita,
  postVendita,
} from "../controller/controllerVendite.js";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";

const routerVendite = express.Router();

routerVendite.get("/", getAllVendite);
routerVendite.post("/", postVendita);
routerVendite.get("/:id", checkIdMiddleware, getDettagliVendita);

export default routerVendite;
