import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, postData } from "../utils/utilsCRUD.js";
import { handleAsyncThunks } from "../utils/handleAsyncThunks.js";

// GET ricevi tutte le vendite
export const fetchVendite = createAsyncThunk(
  "vendite/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/api/vendite");
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati delle vendite.",
      });
    }
  }
);

// GET ricevi dettagli della singola vendita per ID
export const fetchVenditaById = createAsyncThunk(
  "vendite/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchData(`/api/vendite/${id}`);
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati delle vendite.",
      });
    }
  }
);

// POST aggiungi vendita
export const postVendita = createAsyncThunk(
  "vendite/post",
  async (nuovaVendita, { dispatch, rejectWithValue }) => {
    try {
      await postData("/api/vendite", nuovaVendita);
      const vendite = await dispatch(fetchVendite()).unwrap();
      return vendite;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante l'aggiunta della vendita.",
      });
    }
  }
);

const sliceVendite = createSlice({
  name: "vendite",
  initialState: {
    vendite: [],
    selectedVendita: null,
    isLoading: false,
    hasError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunks(builder, fetchVendite, (state, action) => {
      state.vendite = action.payload;
    });

    handleAsyncThunks(builder, fetchVenditaById, (state, action) => {
      state.selectedVendita = action.payload;
    });

    handleAsyncThunks(builder, postVendita, (state, action) => {
      state.vendite = action.payload;
    });
  },
});

export default sliceVendite.reducer;
