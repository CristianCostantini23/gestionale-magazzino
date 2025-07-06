import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/products.js";

dotenv.config();

const app = express();

app.use(express.json());

// TODO: configura le routes

app.use("/api/products", productRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
