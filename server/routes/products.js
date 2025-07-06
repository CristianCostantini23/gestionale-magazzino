import express from "express";
import {
  getAllProducts,
  addNewProduct,
  updateProduct,
} from "../controller/productsController.js";

const productRoutes = express.Router();

productRoutes.get("/", getAllProducts);
productRoutes.post("/", addNewProduct);
productRoutes.put("/:id", updateProduct);

export default productRoutes;
