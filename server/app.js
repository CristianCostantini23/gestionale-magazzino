import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/products.js";
import entityRoutes from "./routes/entities.js";
import brandsRouter from "./routes/brands.js";
import suppliersRouter from "./routes/suppliers.js";
import incomingStockRouter from "./routes/incomingStock.js";
import stockMovementsRouter from "./routes/stockMovements.js";
import salesRoute from "./routes/sales.js";

dotenv.config();

const app = express();

app.use(express.json());

// configura le routes

app.use("/api/products", productRoutes);
app.use("/api/entities", entityRoutes);
app.use("/api/brands", brandsRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/incoming-stock", incomingStockRouter);
app.use("/api/stock-movements", stockMovementsRouter);
app.use("/api/sales", salesRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
