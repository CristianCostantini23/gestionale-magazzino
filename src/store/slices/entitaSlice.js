import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "../utils/utilsCRUD.js";
import { handleAsyncStates } from "../utils/handleAsyncStates.js";

// GET ricevi tutte le entità
export const fetchEntita = createAsyncThunk("entita/fetchAll", async () => {
  return await fetchData("/api/entities");
});

// GET ricevi entità per ID
export const fetchEntitaById = createAsyncThunk(
  "entita/fetchById",
  async (id) => {
    return fetchData(`/api/entities/${id}`);
  }
);

// POST aggiungi entità
export const postEntita = createAsyncThunk(
  "entita/create",
  async (nuovaEntita, { dispatch }) => {
    try {
      await postData("/api/entities", nuovaEntita);
      const entita = dispatch(fetchEntita()).unwrap();
      return entita;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        errore: "Errore durante l'aggiunta dell'entità.",
      });
    }
  }
);

// PUT aggiorna entità
export const updateEntita = createAsyncThunk(
  "entita/update",
  async ({ id, data }, { dispatch }) => {
    try {
      await updateData(`/api/entities/${id}`, data);
      const entita = dispatch(fetchEntita()).unwrap();
      return entita;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        errore: "Errore durante l'aggiornamento dell'entità.",
      });
    }
  }
);

// DELETE elimina entità
export const deleteEntita = createAsyncThunk(
  "entita/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await deleteData(`/api/entities/${id}`);
      const entita = dispatch(fetchEntita()).unwrap();
      return entita;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        errore: "Errore durante l'eliminazione dell'entità.",
      });
    }
  }
);

const entitaSlice = createSlice({
  name: "entita",
  initialState: {
    entita: [],
    selectedEntita: null,
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncStates(builder, fetchEntita, (state, action) => {
      state.entita = action.payload;
      state.selectedEntita = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, fetchEntitaById, (state, action) => {
      state.selectedEntita = action.payload;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, postEntita, (state, action) => {
      state.entita = action.payload;
      state.selectedEntita = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, updateEntita, (state, action) => {
      state.entita = action.payload;
      state.selectedEntita = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, deleteEntita, (state, action) => {
      state.entita = action.payload;
      state.selectedEntita = null;
      state.isLoading = false;
      state.hasError = false;
    });
  },
});

export default entitaSlice.reducer;
