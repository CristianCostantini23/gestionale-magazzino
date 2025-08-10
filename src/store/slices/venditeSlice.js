import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, postData } from "../utils/utilsCRUD.js";
import { handleAsyncStates } from "../utils/handleAsyncStates.js";

// GET ricevi tutte le vendite
export const fetchVendite = createAsyncThunk(
  "vendite/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/api/sales");
    } catch (errore) {
      return rejectWithValue(
        errore.response?.data?.errore || "Errore nel recupero delle vendite"
      );
    }
  }
);

// GET ricevi singola vendita per ID
export const fetchVenditaById = createAsyncThunk(
  "vendite/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchData(`/api/sales/${id}`);
    } catch (errore) {
      return rejectWithValue(
        errore.response?.data?.errore || "Errore nel recupero della vendita"
      );
    }
  }
);

// POST aggiungi vendita
export const postVendita = createAsyncThunk(
  "vendite/post",
  async (nuovaVendita, { dispatch, rejectWithValue }) => {
    try {
      await postData("/api/sales", nuovaVendita);
      return await dispatch(fetchVendite()).unwrap();
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        errore: "Errore durante l'aggiunta della vendita.",
      });
    }
  }
);

// GET ricevi tutti i dati per popolare la tabella
export const getDettagliVendite = createAsyncThunk(
  "vendite/getDettagli",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/api/sales/details");
    } catch (errore) {
      return (
        rejectWithValue(errore.response?.data?.errore) ||
        "Errore nel recupero delle vendite dettagliate"
      );
    }
  }
);

const venditeSlice = createSlice({
  name: "vendite",
  initialState: {
    vendite: [],
    selectedVendita: null,
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncStates(builder, fetchVendite, (state, action) => {
      state.vendite = action.payload;
      state.selectedVendita = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, fetchVenditaById, (state, action) => {
      state.selectedVendita = action.payload;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, postVendita, (state, action) => {
      state.vendite = action.payload;
      state.selectedVendita = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, getDettagliVendite, (state, action) => {
      state.vendite = action.payload;
      state.selectedVendita = null;
      state.isLoading = false;
      state.hasError = false;
    });
  },
});

export default venditeSlice.reducer;
