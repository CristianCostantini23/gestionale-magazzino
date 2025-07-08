import express from "express";
import {
  getAllProducts,
  addNewProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productsController.js";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";

const productRoutes = express.Router();

productRoutes.get("/", getAllProducts);
productRoutes.post("/", addNewProduct);
productRoutes.put("/:id", checkIdMiddleware, updateProduct);
productRoutes.delete("/:id", checkIdMiddleware, deleteProduct);

export default productRoutes;
