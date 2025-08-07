import express from "express";
import {
  createSale,
  getAllSales,
  getSaleById,
  getAllSalesDetails,
} from "../controller/salesController.js";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";

const salesRoute = express.Router();

salesRoute.get("/", getAllSales);
salesRoute.get("/details", getAllSalesDetails);
salesRoute.get("/:id", checkIdMiddleware, getSaleById);
salesRoute.post("/", createSale);

export default salesRoute;
