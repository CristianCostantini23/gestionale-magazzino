import express from "express";
import {
  getAllProducts,
  addNewProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productsController.js";

const productRoutes = express.Router();

productRoutes.get("/", getAllProducts);
productRoutes.post("/", addNewProduct);
productRoutes.put("/:id", updateProduct);
productRoutes.delete("/:id", deleteProduct);

export default productRoutes;
