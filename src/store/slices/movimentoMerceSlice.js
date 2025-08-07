import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, postData } from "../utils/utilsCRUD.js";
import { handleAsyncStates } from "../utils/handleAsyncStates.js";

// GET ricevi tutti i movimenti merce
export const fetchAllmovimentiMerce = createAsyncThunk(
  "movimentiMerce/fetchAll",
  async () => {
    return await fetchData("/api/stock-movements");
  }
);

// POST crea uno spostamento merce
export const postMovimentoMerce = createAsyncThunk(
  "movimentiMerce/post",
  async (nuovoMovimento, { dispatch }) => {
    await postData("/api/stock-movements");
    return dispatch(fetchAllmovimentiMerce()).unwrap();
  }
);

const movimentoMerceSlice = createSlice({
  name: "movimentoMerce",
  initialState: {
    movimenti: [],
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncStates(builder, fetchAllmovimentiMerce, (state, action) => {
      state.movimenti = action.payload;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, postMovimentoMerce, (state, action) => {
      state.movimenti = action.payload;
      state.isLoading = false;
      state.hasError = false;
    });
  },
});

export default movimentoMerceSlice.reducer;
