import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api/api";
import { GET_COLLECTIFS } from "../../constants/constants";

export const getCollectifs = createAsyncThunk(
  "collectifs/getAllCollectifs",
  async (_, thunkAPI) => {
    let error;
    let status;
    try {
      const response = await getRequest(GET_COLLECTIFS);
      error = response.error;
      status = response.status;
      if (status <= 201) {
        let { data } = response.result;
        return thunkAPI.fulfillWithValue({ data, status });
      }
      if (status >= 400 || error) {
        const { message } = response.error;
        return thunkAPI.rejectWithValue({ message, status });
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
    loadingCollectifs: false,
    errorCollectifs: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCollectifs.pending, (state) => {
        if (!state.loadingCollectifs) {
          state.loadingCollectifs = true;
        }
      })
      .addCase(getCollectifs.fulfilled, (state, action) => {
        if (state.loadingCollectifs) {
          state.loadingCollectifs = action.payload;
          state.loadingCollectifs = false;
        }
      })
      .addCase(getCollectifs.rejected, (state, action) => {
        if (state.loadingCollectifs) {
          state.loadingCollectifs = false;
          state.errorCollectifs = action.payload;
        }
      });
  },
});
export default collectifsSlice.reducer;
