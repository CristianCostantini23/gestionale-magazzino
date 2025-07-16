import { configureStore } from "@reduxjs/toolkit";
import brandsReducer from "./slices/brandsSlice.js";
import entitaReducer from "./slices/entitaSlice.js";
import fornitoriReducer from "./slices/fornitoriSlice.js";
import prodottiReducer from "./slices/prodottiSlice.js";
import scarichiMerceReducer from "./slices/scarichiMerceSlice.js";
import venditeReducer from "./slices/venditeSlice.js";
import movimentoMerceReducer from "./slices/movimentoMerceSlice.js";

export const store = configureStore({
  reducer: {
    brands: brandsReducer,
    entita: entitaReducer,
    fornitori: fornitoriReducer,
    prodotti: prodottiReducer,
    scarichiMerce: scarichiMerceReducer,
    vendite: venditeReducer,
    movimentoMerce: movimentoMerceReducer,
  },
});
