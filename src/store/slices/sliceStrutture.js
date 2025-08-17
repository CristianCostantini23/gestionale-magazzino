import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "../utils/utilsCRUD.js";
import { handleAsyncThunks } from "../utils/handleAsyncThunks.js";

// GET ricevi tutte le Strutture
export const fetchStrutture = createAsyncThunk(
  "entita/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/api/strutture");
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati delle strutture.",
      });
    }
  }
);

// GET ricevi Struttura per ID
export const fetchStrutturaById = createAsyncThunk(
  "entita/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return fetchData(`/api/strutture/${id}`);
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati delle strutture.",
      });
    }
  }
);

// POST aggiungi Struttura
export const postStruttura = createAsyncThunk(
  "entita/create",
  async (nuovaStruttura, { dispatch, rejectWithValue }) => {
    try {
      await postData("/api/strutture", nuovaStruttura);
      const struttura = dispatch(fetchStrutture()).unwrap();
      return struttura;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante l'aggiunta della struttura.",
      });
    }
  }
);

// PUT aggiorna Struttura
export const updateStruttura = createAsyncThunk(
  "entita/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      await updateData(`/api/strutture/${id}`, data);
      const struttura = dispatch(fetchStrutture()).unwrap();
      return struttura;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante l'aggiornamento della struttura.",
      });
    }
  }
);

// DELETE elimina Struttura
export const deleteStruttura = createAsyncThunk(
  "entita/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await deleteData(`/api/strutture/${id}`);
      const struttura = dispatch(fetchStrutture()).unwrap();
      return struttura;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante l'eliminazione della struttura.",
      });
    }
  }
);

const sliceStrutture = createSlice({
  name: "strutture",
  initialState: {
    strutture: [],
    selectedStruttura: null,
    isLoading: false,
    hasError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunks(builder, fetchStrutture, (state, action) => {
      state.strutture = action.payload;
    });

    handleAsyncThunks(builder, fetchStrutturaById, (state, action) => {
      state.selectedStruttura = action.payload;
    });

    handleAsyncThunks(builder, postStruttura, (state, action) => {
      state.strutture = action.payload;
    });

    handleAsyncThunks(builder, updateStruttura, (state, action) => {
      state.strutture = action.payload;
    });

    handleAsyncThunks(builder, deleteStruttura, (state, action) => {
      state.entita = action.payload;
    });
  },
});

export default sliceStrutture.reducer;
