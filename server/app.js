import express from "express";
import dotenv from "dotenv";
import routerFornitori from "./routers/fornitori.js";
import routerStrutture from "./routers/strutture.js";
import routerVendite from "./routers/vendite.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/fornitori", routerFornitori);
app.use("/api/strutture", routerStrutture);
app.use("/api/vendite", routerVendite);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
