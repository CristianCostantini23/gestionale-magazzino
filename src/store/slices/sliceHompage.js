import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../utils/utilsCRUD";
import { handleAsyncThunks } from "../utils/handleAsyncThunks";

export const fetchDatiGraficoVendite = createAsyncThunk(
  "homepage/getGraficoVendite",
  async (query, { rejectWithValue }) => {
    try {
      return await fetchData(`/api/homepage/vendite?period=${query}`);
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati.",
      });
    }
  }
);

export const fetchUltimoScarico = createAsyncThunk(
  "homepage/ultimoScarico",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/api/homepage/ultimoScarico");
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati.",
      });
    }
  }
);

export const fetchUltimoMovimento = createAsyncThunk(
  "homepage/ultimoMovimento",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/api/homepage/ultimoMovimento");
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati.",
      });
    }
  }
);

const sliceHomepage = createSlice({
  name: "homepage",
  initialState: {
    graficoVendite: [{ label: "", totale: "" }],
    ultimoMovimento: {
      id: "",
      struttura: "",
      data: "",
      documento: "",
      note: "",
    },
    ultimoScarico: {
      id: "",
      struttura: "",
      data: "",
      fornitore: "",
      documento: "",
      note: "",
    },
    isLoading: false,
    hasError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunks(builder, fetchDatiGraficoVendite, (state, action) => {
      state.graficoVendite = action.payload;
    });

    handleAsyncThunks(builder, fetchUltimoMovimento, (state, action) => {
      state.ultimoMovimento = action.payload;
    });

    handleAsyncThunks(builder, fetchUltimoScarico, (state, action) => {
      state.ultimoScarico = action.payload;
    });
  },
});

export default sliceHomepage.reducer;
