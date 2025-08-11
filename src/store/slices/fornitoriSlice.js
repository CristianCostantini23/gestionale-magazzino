import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "../utils/utilsCRUD.js";
import { handleAsyncStates } from "../utils/handleAsyncStates.js";

// GET ricevi tutti i fornitori
export const fetchfornitori = createAsyncThunk(
  "fornitori/fetchAll",
  async () => {
    return await fetchData("/api/suppliers");
  }
);

// GET ricevi fornitore per ID
export const fetchFornitoreById = createAsyncThunk(
  "fornitori/fetchById",
  async (id) => {
    return fetchData(`/api/suppliers/${id}`);
  }
);

// POST aggiungi fornitore
export const postfornitore = createAsyncThunk(
  "fornitori/create",
  async (nuovoFornitore, { dispatch, rejectWithValue }) => {
    try {
      await postData("/api/suppliers", nuovoFornitore);
      const fornitori = await dispatch(fetchfornitori()).unwrap();
      return fornitori;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        errore: "Errore durante l'aggiunta del fornitore.",
      });
    }
  }
);

// PUT aggiorna fornitore
export const updateFornitore = createAsyncThunk(
  "fornitori/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      await updateData(`/api/suppliers/${id}`, data);
      const fornitori = await dispatch(fetchfornitori()).unwrap();
      return fornitori;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        errore: "Errore durante l'aggiornamento del fornitore.",
      });
    }
  }
);

// DELETE elimina fornitore
export const deleteFornitore = createAsyncThunk(
  "fornitori/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await deleteData(`/api/suppliers/${id}`);
      const fornitori = await dispatch(fetchfornitori()).unwrap();
      return fornitori;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        errore: "Errore durante l'eliminazione del fornitore.",
      });
    }
  }
);

const fornitoriSlice = createSlice({
  name: "fornitori",
  initialState: {
    fornitori: [],
    selectedFornitore: null,
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncStates(builder, fetchfornitori, (state, action) => {
      state.fornitori = action.payload;
      state.selectedFornitore = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, fetchFornitoreById, (state, action) => {
      state.selectedFornitore = action.payload;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, postfornitore, (state, action) => {
      state.fornitori = action.payload;
      state.selectedFornitore = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, updateFornitore, (state, action) => {
      state.fornitori = action.payload;
      state.selectedFornitore = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, deleteFornitore, (state, action) => {
      state.fornitori = action.payload;
      state.selectedFornitore = null;
      state.isLoading = false;
      state.hasError = false;
    });
  },
});

export default fornitoriSlice.reducer;
