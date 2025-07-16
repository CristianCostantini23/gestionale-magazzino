import express from "express";
import {
  createIncomingStock,
  getAllInconmingStock,
  getIncomingStockById,
} from "../controller/incomingStockController.js";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";

const incomingStockRouter = express.Router();

incomingStockRouter.get("/", getAllInconmingStock);
incomingStockRouter.get("/:id", checkIdMiddleware, getIncomingStockById);
incomingStockRouter.post("/", createIncomingStock);

export default incomingStockRouter;
