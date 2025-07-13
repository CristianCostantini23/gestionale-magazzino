import express from "express";
import {
  createSale,
  getAllSales,
  getSaleById,
} from "../controller/salesController.js";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";

const salesRoute = express.Router();

salesRoute.get("/", getAllSales);
salesRoute.get("/:id", checkIdMiddleware, getSaleById);
salesRoute.post("/", createSale);

export default salesRoute;
