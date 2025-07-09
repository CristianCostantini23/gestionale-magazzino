import express from "express";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";
import {
  getAllBrands,
  getBrandById,
  addBrand,
  updatebrand,
  deleteBrand,
} from "../controller/brandsController.js";

const brandsRouter = express.Router();

brandsRouter.get("/", getAllBrands);
brandsRouter.get("/:id", checkIdMiddleware, getBrandById);
brandsRouter.post("/", addBrand);
brandsRouter.put("/:id", checkIdMiddleware, updatebrand);
brandsRouter.delete("/:id", checkIdMiddleware, deleteBrand);

export default brandsRouter;
