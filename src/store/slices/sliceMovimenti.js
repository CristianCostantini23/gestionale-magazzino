import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, postData } from "../utils/utilsCRUD.js";
import { handleAsyncThunks } from "../utils/handleAsyncThunks.js";

// GET ricevi tutti i movimenti
export const fetchMovimenti = createAsyncThunk(
  "movimenti/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/api/movimenti");
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati dei movimenti merce.",
      });
    }
  }
);

// GET ricevi dettagli del singolo movimento per ID
export const fetchMovimentoById = createAsyncThunk(
  "movimenti/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchData(`/api/movimenti/${id}`);
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dettagli del movimento merce.",
      });
    }
  }
);

// POST aggiungi movimento
export const postMovimento = createAsyncThunk(
  "movimenti/post",
  async (nuovoMovimento, { dispatch, rejectWithValue }) => {
    try {
      await postData("/api/movimenti", nuovoScarico);
      const movimenti = await dispatch(fetchMovimenti()).unwrap();
      return movimenti;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante l'aggiunta del movimento.",
      });
    }
  }
);

const sliceMovimenti = createSlice({
  name: "movimenti",
  initialState: {
    movimenti: [],
    selectedMovimento: {
      struttura_origine: "",
      struttura_destinazione: "",
      data_trasferimento: "",
      prodotti: [],
    },
    isLoading: false,
    hasError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunks(builder, fetchMovimenti, (state, action) => {
      state.movimenti = action.payload;
    });

    handleAsyncThunks(builder, fetchMovimentoById, (state, action) => {
      state.selectedMovimento = action.payload;
    });

    handleAsyncThunks(builder, postMovimento, (state, action) => {
      state.movimenti = action.payload;
    });
  },
});

export default sliceMovimenti.reducer;
