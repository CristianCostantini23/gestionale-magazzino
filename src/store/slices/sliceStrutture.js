import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "../utils/utilsCRUD.js";
import { handleAsyncThunks } from "../utils/handleAsyncThunks.js";

// GET ricevi tutte le Strutture
export const fetchStrutture = createAsyncThunk("entita/fetchAll", async () => {
  return await fetchData("/api/strutture");
});

// GET ricevi Struttura per ID
export const fetchStrutturaById = createAsyncThunk(
  "entita/fetchById",
  async (id) => {
    return fetchData(`/api/strutture/${id}`);
  }
);

// POST aggiungi Struttura
export const postStruttura = createAsyncThunk(
  "entita/create",
  async (nuovaEntita, { dispatch }) => {
    try {
      await postData("/api/strutture", nuovaEntita);
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

// PUT aggiorna Struttura
export const updateStruttura = createAsyncThunk(
  "entita/update",
  async ({ id, data }, { dispatch }) => {
    try {
      await updateData(`/api/strutture/${id}`, data);
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

// DELETE elimina Struttura
export const deleteStruttura = createAsyncThunk(
  "entita/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await deleteData(`/api/strutture/${id}`);
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

const sliceStrutture = createSlice({
  name: "strutture",
  initialState: {
    strutture: [],
    selectedStruttura: null,
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunks(builder, fetchStrutture, (state, action) => {
      state.strutture = action.payload;
      state.selectedStruttura = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncThunks(builder, fetchStrutturaById, (state, action) => {
      state.selectedStruttura = action.payload;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncThunks(builder, postStruttura, (state, action) => {
      state.strutture = action.payload;
      state.selectedStruttura = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncThunks(builder, updateStruttura, (state, action) => {
      state.strutture = action.payload;
      state.selectedStruttura = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncThunks(builder, deleteStruttura, (state, action) => {
      state.entita = action.payload;
      state.selectedEntita = null;
      state.isLoading = false;
      state.hasError = false;
    });
  },
});

export default sliceStrutture.reducer;
