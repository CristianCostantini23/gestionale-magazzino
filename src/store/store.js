import { configureStore } from "@reduxjs/toolkit";
import fornitoriReducer from "./slices/sliceFornitori.js";
import struttureReducer from "./slices/sliceStrutture.js";
import venditeReducer from "./slices/sliceVendite.js";
import inventariReducer from "./slices/sliceInventari.js";
import scarichiReducer from "./slices/sliceScarichi.js";
import movimentiReducer from "./slices/sliceMovimenti.js";
import prodottiReducer from "./slices/sliceProdotti.js";

export const store = configureStore({
  reducer: {
    fornitori: fornitoriReducer,
    strutture: struttureReducer,
    vendite: venditeReducer,
    inventari: inventariReducer,
    scarichi: scarichiReducer,
    movimenti: movimentiReducer,
    prodotti: prodottiReducer,
  },
});
