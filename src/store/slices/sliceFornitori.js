import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "../utils/utilsCRUD.js";
import { handleAsyncThunks } from "../utils/handleAsyncThunks.js";

// GET ricevi tutti i fornitori
export const fetchFornitori = createAsyncThunk(
  "fornitori/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/api/fornitori");
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati dei fornitori.",
      });
    }
  }
);

// GET ricevi fornitore per ID
export const fetchFornitoreById = createAsyncThunk(
  "fornitori/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return fetchData(`/api/fornitori/${id}`);
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati dei fornitori.",
      });
    }
  }
);

// POST aggiungi fornitore
export const postFornitore = createAsyncThunk(
  "fornitori/create",
  async (nuovoFornitore, { dispatch, rejectWithValue }) => {
    try {
      await postData("/api/fornitori", nuovoFornitore);
      const fornitori = await dispatch(fetchFornitori()).unwrap();
      return fornitori;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante l'aggiunta del fornitore.",
      });
    }
  }
);

// PUT aggiorna fornitore
export const updateFornitore = createAsyncThunk(
  "fornitori/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      await updateData(`/api/fornitori/${id}`, data);
      const fornitori = await dispatch(fetchFornitori()).unwrap();
      return fornitori;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante l'aggiornamento del fornitore.",
      });
    }
  }
);

// DELETE elimina fornitore
export const deleteFornitore = createAsyncThunk(
  "fornitori/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await deleteData(`/api/fornitori/${id}`);
      const fornitori = await dispatch(fetchFornitori()).unwrap();
      return fornitori;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante l'eliminazione del fornitore.",
      });
    }
  }
);

const sliceFornitori = createSlice({
  name: "fornitori",
  initialState: {
    fornitori: [],
    selectedFornitore: null,
    isLoading: false,
    hasError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunks(builder, fetchFornitori, (state, action) => {
      state.fornitori = action.payload;
    });

    handleAsyncThunks(builder, fetchFornitoreById, (state, action) => {
      state.selectedFornitore = action.payload;
    });

    handleAsyncThunks(builder, postFornitore, (state, action) => {
      state.fornitori = action.payload;
    });

    handleAsyncThunks(builder, updateFornitore, (state, action) => {
      state.fornitori = action.payload;
    });

    handleAsyncThunks(builder, deleteFornitore, (state, action) => {
      state.fornitori = action.payload;
    });
  },
});

export default sliceFornitori.reducer;
