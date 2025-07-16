// funzione per gestire gli stati generati da createAsyncThunk
// prende builder, l'asyncThunk ed una funzione per gestire lo stato fullfilled
export function handleAsyncStates(builder, asyncThunk, onFulFilled) {
  builder
    .addCase(asyncThunk.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
    })
    .addCase(asyncThunk.rejected, (state, action) => {
      state.isLoadingoading = false;
      state.hasError = true;
    })
    .addCase(asyncThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.hasError = false;
      onFulFilled(state, action);
    });
}
