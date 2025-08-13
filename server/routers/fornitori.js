import express from "express";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";
import {
  getAllFornitori,
  getFornitoreById,
  postFornitore,
  updateFornitore,
  deleteFornitore,
} from "../controller/controllerFornitori.js";

const routerFornitori = express.Router();

routerFornitori.get("/", getAllFornitori);
routerFornitori.post("/", postFornitore);
routerFornitori.get("/:id", checkIdMiddleware, getFornitoreById);
routerFornitori.put("/:id", checkIdMiddleware, updateFornitore);
routerFornitori.delete("/:id", checkIdMiddleware, deleteFornitore);

export default routerFornitori;
