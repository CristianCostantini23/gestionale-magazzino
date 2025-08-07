import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "../utils/utilsCRUD.js";
import { handleAsyncStates } from "../utils/handleAsyncStates.js";

// GET ricevi tutti i brands
export const fetchBrands = createAsyncThunk("brands/fetchAll", async () => {
  return await fetchData("/api/brands");
});

// GET ricevi brand per ID
export const fetchBrandById = createAsyncThunk(
  "brands/fetchById",
  async (id) => {
    return fetchData(`/api/brands/${id}`);
  }
);

// POST aggiungi brand
export const postBrand = createAsyncThunk(
  "brands/create",
  async (nuovoBrand, { dispatch, rejectWithValue }) => {
    try {
      await postData("/api/brands", nuovoBrand);
      return dispatch(fetchBrands()).unwrap();
    } catch (error) {
      return rejectWithValue(
        error.response.data || { errore: "Errore imprevisto" }
      );
    }
  }
);

// PUT aggiorna brand
export const updateBrand = createAsyncThunk(
  "brands/update",
  async ({ id, data }, { dispatch }) => {
    await updateData(`/api/brands/${id}`, data);
    return dispatch(fetchBrands()).unwrap();
  }
);

// DELETE elimina brand
export const deleteBrand = createAsyncThunk(
  "brands/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await deleteData(`/api/brands/${id}`);
      return dispatch(fetchBrands()).unwrap();
    } catch (errore) {
      rejectWithValue(errore.response?.data) || {
        messaggio: "Errore sconosciuto",
      };
    }
  }
);

const brandsSlice = createSlice({
  name: "brands",
  initialState: {
    brands: [],
    selectedBrand: null,
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncStates(builder, fetchBrands, (state, action) => {
      state.brands = action.payload;
      state.selectedBrand = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, fetchBrandById, (state, action) => {
      state.selectedBrand = action.payload;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, postBrand, (state, action) => {
      state.brands = action.payload;
      state.selectedBrand = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, updateBrand, (state, action) => {
      state.brands = action.payload;
      state.selectedBrand = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, deleteBrand, (state, action) => {
      state.brands = action.payload;
      state.isLoading = false;
      state.hasError = false;
      state.selectedBrand = null;
    });
  },
});

export default brandsSlice.reducer;
