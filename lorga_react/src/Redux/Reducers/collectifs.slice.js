import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api/api";
import { GET_COLLECTIFS } from "../../constants/constants";

export const getCollectifs = createAsyncThunk(
  "collectifs/getAllCollectifs",
  async (_, { rejectWithValue }) => {
    let error;
    let status;
    try {
      const response = await getRequest(GET_COLLECTIFS);
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
export const collectifsSlice = createSlice({
  name: "collectifs",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCollectifs.pending, (state) => {
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(getCollectifs.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = action.payload;
          state.loading = false;
        }
      })
      .addCase(getCollectifs.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.payload;
        }
      });
  },
});
export default collectifsSlice.reducer;
