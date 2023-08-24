import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getImageRequest } from "../../api/api";

export const getUpload = createAsyncThunk(
  "upload/get",
  async (url, { rejectWithValue }) => {
    let error;
    let status;
    try {
      const response = await getImageRequest(url);
      status = response.status;
      error = response.error;
      if (status <= 201) {
        return response;
      }
      if (status >= 400 || error) {
        const { message } = response.error;
        return rejectWithValue({ message, status });
      }
    } catch (e) {
      throw e;
    }
  }
);
export const uploadsSlice = createSlice({
  name: "upload",
  initialState: {
    imageData: null,
    loadingUpload: false,
    errorUpload: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUpload.pending, (state) => {
      if (!state.loadingUpload) {
        state.loadingUpload = true;
        state.errorUpload = null;
      }
    });
    builder.addCase(getUpload.fulfilled, (state, action) => {
      if (state.loadingUpload) {
        state.loadingUpload = action.payload;
        state.loadingUpload = false;
        state.imageData = action.payload;
      }
    });
    builder.addCase(getUpload.rejected, (state, action) => {
      if (state.loadingUpload) {
        state.loadingUpload = false;
        state.errorUpload = action.payload;
      }
    });
  },
});

export default uploadsSlice.reducer;
