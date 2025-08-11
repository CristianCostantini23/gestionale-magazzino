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
      const brands = await dispatch(fetchBrands()).unwrap();
      return brands;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        errore: "Errore durante l'aggiunta del brand.",
      });
    }
  }
);

// PUT aggiorna brand
export const updateBrand = createAsyncThunk(
  "brands/update",
  async ({ id, data }, { dispatch }) => {
    try {
      await updateData(`/api/brands/${id}`, data);
      const brands = await dispatch(fetchBrands()).unwrap();
      return brands;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        errore: "Errore durante l'aggiornamento del brand.",
      });
    }
  }
);

// DELETE elimina brand
export const deleteBrand = createAsyncThunk(
  "brands/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await deleteData(`/api/brands/${id}`);
      const brands = await dispatch(fetchBrands()).unwrap();
      return brands;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        errore: "Errore durante l'eliminazione del brand.",
      });
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
