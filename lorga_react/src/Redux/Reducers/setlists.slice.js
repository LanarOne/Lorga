import { createSlice } from "@reduxjs/toolkit";

export const setlistsSlice = createSlice({
  name: "setlists",
  initialState: { data: [], loadingSetlists: false, errorSetlist: null },
  reducers: {},
});
export default setlistsSlice.reducer;
