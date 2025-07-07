import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/products.js";
import entityRoutes from "./routes/entities.js";

dotenv.config();

const app = express();

app.use(express.json());

// configura le routes

app.use("/api/products", productRoutes);
app.use("/api/entities", entityRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
