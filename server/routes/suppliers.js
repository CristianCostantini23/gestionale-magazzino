import express from "express";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";
import {
  getAllSuppliers,
  getSupplierById,
  addSupplier,
  updateSuppliers,
  deleteSupplier,
} from "../controller/suppliersController.js";

const suppliersRouter = express.Router();

suppliersRouter.get("/", getAllSuppliers);
suppliersRouter.get("/:id", checkIdMiddleware, getSupplierById);
suppliersRouter.post("/", addSupplier);
suppliersRouter.put("/:id", checkIdMiddleware, updateSuppliers);
suppliersRouter.delete("/:id", checkIdMiddleware, deleteSupplier);

export default suppliersRouter;
