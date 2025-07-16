import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "../utils/utilsCRUD.js";
import { handleAsyncStates } from "../utils/handleAsyncStates.js";

// GET ricevi tutti i prodotti
export const fetchProdotti = createAsyncThunk("prodotti/fetchAll", async () => {
  return await fetchData("/api/products");
});

// GET ricevi prodotto per id
export const fetchProdottiById = createAsyncThunk(
  "prodotti/fetchById",
  async (id) => {
    return await fetchData(`/api/products/${id}`);
  }
);

// POST crea un nuovo prodotto
export const postProdotto = createAsyncThunk(
  "prodotti/create",
  async (nuovoProdotto, { dispatch }) => {
    await postData("/api/products", nuovoProdotto);
    return dispatch(fetchProdotti()).unwrap();
  }
);

// PUT aggiorna prodotto
export const updateprodotto = createAsyncThunk(
  "prodotti/update",
  async ({ id, data }, { dispatch }) => {
    await updateData(`/api/products/${id}`, data);
    return dispatch(fetchProdotti()).unwrap();
  }
);

// DELETE elimina prodotto
export const deleteProdotto = createAsyncThunk(
  "prodotti/delete",
  async (id, { dispatch }) => {
    await deleteData(`/api/products/${id}`);
    return dispatch(fetchProdotti()).unwrap();
  }
);

const prodottiSlice = createSlice({
  name: "prodotti",
  initialState: {
    prodotti: [],
    selectedProdotto: null,
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncStates(builder, fetchProdotti, (state, action) => {
      state.prodotti = action.payload;
      state.selectedProdotto = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, fetchProdottiById, (state, action) => {
      state.selectedProdotto = action.payload;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, postProdotto, (state, action) => {
      state.prodotti = action.payload;
      state.selectedProdotto = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, updateprodotto, (state, action) => {
      state.prodotti = action.payload;
      state.selectedProdotto = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, deleteProdotto, (state, action) => {
      state.prodotti = action.payload;
      state.selectedProdotto = null;
      state.isLoading = false;
      state.hasError = false;
    });
  },
});

export default prodottiSlice.reducer;
