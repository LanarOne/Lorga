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
        state.error = action.payload;
      }
    });
  },
});

export default uploadsSlice.reducer;
