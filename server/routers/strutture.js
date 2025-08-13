import express from "express";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";
import {
  getAllStrutture,
  getStrutturaById,
  postStruttura,
  updateStruttura,
  deleteStruttura,
} from "../controller/controllerStrutture.js";

const routerStrutture = express.Router();

routerStrutture.get("/", getAllStrutture);
routerStrutture.post("/", postStruttura);
routerStrutture.get("/:id", checkIdMiddleware, getStrutturaById);
routerStrutture.put("/:id", checkIdMiddleware, updateStruttura);
routerStrutture.delete("/:id", checkIdMiddleware, deleteStruttura);

export default routerStrutture;
