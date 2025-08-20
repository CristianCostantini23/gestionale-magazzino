import express from "express";
import {
  deleteProdotto,
  fetchAllProdotti,
  postProdotto,
  updateProdotto,
} from "../controller/controllerProdotti.js";
import { checkIdMiddleware } from "../middleware/checkIdMiddleware.js";
import { castToNumber } from "../middleware/castToNumber.js";

const routerProdotti = express.Router();

routerProdotti.get("/", fetchAllProdotti);
routerProdotti.post(
  "/",
  castToNumber(["body"], {
    include: ["prezzo_vendita"],
    deep: false,
    strictDecimal: true,
  }),
  postProdotto
);
routerProdotti.put(
  "/:prodottoId",
  castToNumber(["body"], {
    include: ["prezzo_vendita"],
    deep: false,
    strictDecimal: true,
  }),
  checkIdMiddleware,
  updateProdotto
);
routerProdotti.delete("/:prodottiId", checkIdMiddleware, deleteProdotto);

export default routerProdotti;
