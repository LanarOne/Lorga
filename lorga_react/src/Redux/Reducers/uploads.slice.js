import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getImageRequest, getRequest } from "../../api/api";

export const getUpload = createAsyncThunk("upload/get", async (url) => {
  if (url) {
    const response = await getImageRequest(url);
    return response;
  }
});
export const uploadsSlice = createSlice({
  name: "upload",
  initialState: {
    imageData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUpload.pending, (state) => {
      if (!state.loading) {
        state.loading = true;
        state.error = null;
      }
    });
    builder.addCase(getUpload.fulfilled, (state, action) => {
      if (state.loading) {
        state.loading = action.payload;
        state.loading = false;
        state.imageData = action.payload;
      }
    });
    builder.addCase(getUpload.rejected, (state, action) => {
      if (state.loading) {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export default uploadsSlice.reducer;
