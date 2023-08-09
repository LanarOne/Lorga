import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api/api";
import { GET_ARTISTES } from "../../constants/constants";

export const getArtistes = createAsyncThunk(
  "artistes.slice/getArtistes",
  async (_, { rejectWithValue }) => {
    let error;
    let status;
    try {
      const response = await getRequest(GET_ARTISTES);
      error = response.error;
      status = response.status;
      if (status <= 201) {
        let { data } = response.result;
        return { data, status };
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

export const artisteSlice = createSlice({
  name: "artistes",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getArtistes.pending, (state, action) => {
      if (!state.loading) {
        state.loading = true;
      }
    });
    builder.addCase(getArtistes.fulfilled, (state, action) => {
      if (state.loading) {
        state.data = action.payload;
        state.loading = false;
      }
    });
    builder.addCase(getArtistes.rejected, (state, action) => {
      if (state.loading) {
        state.loading = false;
        state.error = action.payload;
      }
    });
  },
});
export default artisteSlice.reducer;
