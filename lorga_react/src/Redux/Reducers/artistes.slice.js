import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api/api";
import { API_URL, GET_ARTISTES } from "../../constants/constants";

export const getArtistes = createAsyncThunk(
  "artistes.slice/getArtistes",
  async () => {
    const response = await getRequest(GET_ARTISTES);
    let error = response.error;
    let status = response.status;
    return { data: response.result.data, status, error };
  }
);

export const artisteSlice = createSlice({
  name: "artistes",
  initialState: {
    data: [],
    loading: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getArtistes.pending, (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    });
    builder.addCase(getArtistes.fulfilled, (state, action) => {
      if (state.loading === "pending") {
        state.data = action.payload.data;
        state.loading = "idle";
      }
    });
    builder.addCase(getArtistes.rejected, (state, action) => {
      if (state.loading === "pending") {
        state.loading = "idle";
        state.error = action.payload.data.error;
      }
    });
  },
});
export default artisteSlice.reducer;
