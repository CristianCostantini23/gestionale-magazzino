import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, updateData } from "../utils/utilsCRUD.js";
import { handleAsyncThunks } from "../utils/handleAsyncThunks.js";

export const fetchInventarioByStrutturaId = createAsyncThunk(
  "inventari/getByStrutturaId",
  async (strutturaId, { rejectWithValue }) => {
    try {
      return await fetchData(`/api/inventari/${strutturaId}`);
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante il recupero dei dati dell'inventario.",
      });
    }
  }
);

export const updateQuantitaProdotto = createAsyncThunk(
  "inventari/updateQuantitaProdotto",
  async ({ strutturaId, prodottoId, data }, { rejectWithValue, dispatch }) => {
    try {
      await updateData(`/api/inventari/${strutturaId}/${prodottoId}`, data);
      const inventario = dispatch(fetchInventarioByStrutturaId()).unwrap();
      return inventario;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: "Errore durante la modifica dell'inventario.",
      });
    }
  }
);

const sliceInventari = createSlice({
  name: "inventari",
  initialState: {
    inventari: [],
    selectedInventario: null,
    isLoading: false,
    hasError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunks(
      builder,
      fetchInventarioByStrutturaId,
      (state, action) => {
        state.selectedInventario = action.payload;
      }
    );

    handleAsyncThunks(builder, updateQuantitaProdotto, (state, action) => {
      state.selectedInventario = action.payload;
    });
  },
});

export default sliceInventari.reducer;
