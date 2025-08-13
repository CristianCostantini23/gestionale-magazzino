import { configureStore } from "@reduxjs/toolkit";
import fornitoriReducer from "./slices/sliceFornitori.js";
import struttureReducer from "./slices/sliceStrutture.js";
import venditeReducer from "./slices/sliceVendite.js";

export const store = configureStore({
  reducer: {
    fornitori: fornitoriReducer,
    strutture: struttureReducer,
    vendite: venditeReducer,
  },
});
