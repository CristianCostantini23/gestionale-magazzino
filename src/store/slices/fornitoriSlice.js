import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "../utils/utilsCRUD.js";
import { handleAsyncStates } from "../utils/handleAsyncStates.js";

// GET ricevi tutti i fornitori
const fetchfornitori = createAsyncThunk("fornitori/fetchAll", async () => {
  return await fetchData("/api/fornitori");
});

// GET ricevi fornitore per ID
const fetchFornitoreById = createAsyncThunk(
  "fornitori/fetchById",
  async (id) => {
    return fetchData(`/api/fornitori/${id}`);
  }
);

// POST aggiungi fornitore
const postfornitore = createAsyncThunk(
  "fornitori/create",
  async (nuovoFornitore, { dispatch }) => {
    await postData("/api/fornitori", nuovoFornitore);
    return dispatch(fetchfornitori()).unwrap();
  }
);

// PUT aggiorna fornitore
const updateFornitore = createAsyncThunk(
  "fornitori/update",
  async ({ id, data }, { dispatch }) => {
    await updateData(`/api/fornitori/${id}`, data);
    return dispatch(fetchfornitori()).unwrap();
  }
);

// DELETE elimina fornitore
const deleteFornitore = createAsyncThunk(
  "fornitori/delete",
  async (id, { dispatch }) => {
    await deleteData(`/api/fornitori/${id}`);
    return dispatch(fetchfornitori()).unwrap();
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
