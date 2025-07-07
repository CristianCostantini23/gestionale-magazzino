import express from "express";
import {
  getAllEntities,
  addEntity,
  deleteEntity,
  updateEntity,
} from "../controller/entitiesController.js";

const entityRoutes = express.Router();

entityRoutes.get("/", getAllEntities);
entityRoutes.post("/", addEntity);
entityRoutes.put("/:id", updateEntity);
entityRoutes.delete("/:id", deleteEntity);

export default entityRoutes;
