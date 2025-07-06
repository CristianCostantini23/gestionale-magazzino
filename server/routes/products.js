import express from "express";
import {
  getAllProducts,
  addNewProduct,
} from "../controller/productsController.js";

const productRoutes = express.Router();

productRoutes.get("/", getAllProducts);
productRoutes.post("/", addNewProduct);

export default productRoutes;
