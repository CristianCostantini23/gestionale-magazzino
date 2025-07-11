import express from "express";
import { createIncomingStock } from "../controller/incomingStockController.js";

const incomingStockRouter = express.Router();

incomingStockRouter.post("/", createIncomingStock);

export default incomingStockRouter;
