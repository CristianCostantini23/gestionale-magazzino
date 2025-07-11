import express from "express";
import { createStockMovement } from "../controller/stockMovementsController.js";

const stockMovementsRouter = express.Router();

stockMovementsRouter.post("/", createStockMovement);

export default stockMovementsRouter;
