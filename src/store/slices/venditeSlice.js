import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, postData } from "../utils/utilsCRUD.js";
import { handleAsyncStates } from "../utils/handleAsyncStates.js";

// GET ricevi tutte le vendite
const fetchVendite = createAsyncThunk("vendite/fetchAll", async () => {
  return await fetchData("/api/sales");
});

// GET ricevi singola vendita per ID
const fetchVenditaById = createAsyncThunk("vendite/fetchById", async (id) => {
  return await fetchData(`/api/sales/${id}`);
});

// POST aggiungi vendita
const postVendita = createAsyncThunk(
  "vendite/post",
  async (nuovaVendita, { dispatch }) => {
    await postData("/api/sales", nuovaVendita);
    return dispatch(fetchVendite()).unwrap();
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
  },
});

export default venditeSlice.reducer;
