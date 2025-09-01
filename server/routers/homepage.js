import express from "express";
import { dateFormatter } from "../middleware/dateFormatter.js";
import {
  getDatiGraficoHomepage,
  getUltimoMovimento,
  getUltimoScarico,
} from "../controller/controllerHomepage.js";

const routerHomepage = express.Router();

routerHomepage.get("/vendite", dateFormatter, getDatiGraficoHomepage);
routerHomepage.get("/ultimoScarico", dateFormatter, getUltimoScarico);
routerHomepage.get("/ultimoMovimento", dateFormatter, getUltimoMovimento);

export default routerHomepage;
