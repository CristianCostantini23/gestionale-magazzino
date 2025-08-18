import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, postData } from "../utils/utilsCRUD.js";
import { handleAsyncThunks } from "../utils/handleAsyncThunks.js";

// GET ricevi tutti gli scarichi
export const fetchScarichi = createAsyncThunk(
  "scarichi/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/api/scarichi");
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati degli scarichi.",
      });
    }
  }
);

// GET ricevi dettagli del singolo scarico per ID
export const fetchScaricoById = createAsyncThunk(
  "scarichi/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchData(`/api/scarichi/${id}`);
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

// POST aggiungi scarico
export const postScarico = createAsyncThunk(
  "scarichi/post",
  async (nuovoScarico, { dispatch, rejectWithValue }) => {
    try {
      await postData("/api/scarichi", nuovoScarico);
      const scarichi = await dispatch(fetchScarichi()).unwrap();
      return scarichi;
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

const sliceScarichi = createSlice({
  name: "scarichi",
  initialState: {
    scarichi: [],
    selectedScarico: null,
    isLoading: false,
    hasError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunks(builder, fetchScarichi, (state, action) => {
      state.scarichi = action.payload;
    });

    handleAsyncThunks(builder, fetchScaricoById, (state, action) => {
      state.selectedScarico = action.payload;
    });

    handleAsyncThunks(builder, postScarico, (state, action) => {
      state.scarichi = action.payload;
    });
  },
});

export default sliceScarichi.reducer;
