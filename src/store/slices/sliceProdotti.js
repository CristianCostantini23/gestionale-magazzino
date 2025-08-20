import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "../utils/utilsCRUD.js";
import { handleAsyncThunks } from "../utils/handleAsyncThunks.js";

// GET ricevi tutti i prodotti
export const fetchProdotti = createAsyncThunk(
  "prodotti/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/api/prodotti");
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati dei prodotti.",
      });
    }
  }
);

// POST aggiungi prodotto
export const postProdotto = createAsyncThunk(
  "prodotti/create",
  async (nuovoProdotto, { dispatch, rejectWithValue }) => {
    try {
      await postData("/api/prodotti", nuovoProdotto);
      const prodotti = await dispatch(fetchProdotti()).unwrap();
      return prodotti;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante l'aggiunta del prodotto.",
      });
    }
  }
);

// PUT aggiorna prodotto
export const updateProdotto = createAsyncThunk(
  "prodotti/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      await updateData(`/api/prodotti/${id}`, data);
      const prodotti = await dispatch(fetchProdotti()).unwrap();
      return prodotti;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante l'aggiornamento del prodotto.",
      });
    }
  }
);

// DELETE elimina prodotto
export const deleteProdotto = createAsyncThunk(
  "prodotti/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await deleteData(`/api/prodotti/${id}`);
      const prodotti = await dispatch(fetchProdotti()).unwrap();
      return prodotti;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante l'eliminazione del prodotto.",
      });
    }
  }
);

const sliceProdotti = createSlice({
  name: "prodotti",
  initialState: {
    prodotti: [],
    selectedProdotto: null,
    isLoading: false,
    hasError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunks(builder, fetchProdotti, (state, action) => {
      state.prodotti = action.payload;
    });

    handleAsyncThunks(builder, postProdotto, (state, action) => {
      state.prodotti = action.payload;
    });

    handleAsyncThunks(builder, updateProdotto, (state, action) => {
      state.prodotti = action.payload;
    });

    handleAsyncThunks(builder, deleteProdotto, (state, action) => {
      state.prodotti = action.payload;
    });
  },
});

export default sliceProdotti.reducer;
