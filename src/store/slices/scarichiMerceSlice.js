import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, postData } from "../utils/utilsCRUD.js";
import { handleAsyncStates } from "../utils/handleAsyncStates.js";

// GET ricevi tutti gli scarichi merce
export const fetchAllScarichiMerce = createAsyncThunk(
  "scarichiMerce/fetchAll",
  async () => {
    return await fetchData("/api/incoming-stock");
  }
);

// GET ricevi gli scarichi merce per ID
export const fetchScarichiMerceById = createAsyncThunk(
  "scarichiMerce/fetchById",
  async (id) => {
    return await fetchData(`/api/incoming-stock/${id}`);
  }
);

// POST crea uno scarico merce
export const postScaricoMerce = createAsyncThunk(
  "scarichiMerce/post",
  async (nuovoScaricoMerce, { dispatch }) => {
    try {
      await postData("/api/incoming-stock", nuovoScaricoMerce);
      const scarichi = await dispatch(fetchAllScarichiMerce()).unwrap();
      return scarichi;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        errore: "Errore durante l'aggiunta dello scarico.",
      });
    }
  }
);

const scarichiMerceSlice = createSlice({
  name: "scarichiMerce",
  initialState: {
    scarichi: [],
    selectedScarico: null,
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncStates(builder, fetchAllScarichiMerce, (state, action) => {
      state.scarichi = action.payload;
      state.selectedScarico = null;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, fetchScarichiMerceById, (state, action) => {
      state.selectedScarico = action.payload;
      state.isLoading = false;
      state.hasError = false;
    });

    handleAsyncStates(builder, postScaricoMerce, (state, action) => {
      state.scarichi = action.payload;
      state.selectedScarico = null;
      state.isLoading = false;
      state.hasError = false;
    });
  },
});

export default scarichiMerceSlice.reducer;
