// funzione per gestire gli stati generati da createAsyncThunk
// prende builder, l'asyncThunk ed una funzione per gestire lo stato fullfilled
export function handleAsyncThunks(builder, asyncThunk, onFulFilled) {
  builder
    .addCase(asyncThunk.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
      state.errorMessage = null;
    })
    .addCase(asyncThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.hasError = true;
      state.errorMessage =
        action.payload?.error || action.payload || "Errore sconosciuto";
    })
    .addCase(asyncThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.hasError = false;
      state.errorMessage = null;
      onFulFilled(state, action);
    });
}
