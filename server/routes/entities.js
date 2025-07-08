import express from "express";
import {
  getAllEntities,
  addEntity,
  deleteEntity,
  updateEntity,
} from "../controller/entitiesController.js";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";

const entityRoutes = express.Router();

entityRoutes.get("/", getAllEntities);
entityRoutes.post("/", addEntity);
entityRoutes.put("/:id", checkIdMiddleware, updateEntity);
entityRoutes.delete("/:id", checkIdMiddleware, deleteEntity);

export default entityRoutes;
