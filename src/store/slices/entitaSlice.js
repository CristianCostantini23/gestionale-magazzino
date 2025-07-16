import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "../utils/utilsCRUD.js";
import { handleAsyncStates } from "../utils/handleAsyncStates.js";

// GET ricevi tutte le entità
const fetchEntita = createAsyncThunk("entita/fetchAll", async () => {
  return await fetchData("/api/entita");
});

// GET ricevi entità per ID
const fetchEntitaById = createAsyncThunk("entita/fetchById", async (id) => {
  return fetchData(`/api/entita/${id}`);
});

// POST aggiungi entità
const postEntita = createAsyncThunk(
  "entita/create",
  async (nuovaEntita, { dispatch }) => {
    await postData("/api/entita", nuovaEntita);
    return dispatch(fetchEntita()).unwrap();
  }
);

// PUT aggiorna entità
const updateEntita = createAsyncThunk(
  "entita/update",
  async ({ id, data }, { dispatch }) => {
    await updateData(`/api/entita/${id}`, data);
    return dispatch(fetchEntita()).unwrap();
  }
);

// DELETE elimina entità
const deleteEntita = createAsyncThunk(
  "entita/delete",
  async (id, { dispatch }) => {
    await deleteData(`/api/entita/${id}`);
    return dispatch(fetchEntita()).unwrap();
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
