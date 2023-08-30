import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api/api";
import { GET_BOISSONS } from "../../constants/constants";

export const getBoissons = createAsyncThunk(
  "boissons/getAll",
  async (_, thunkAPI) => {
    let status;
    let error;
    try {
      const response = await getRequest(GET_BOISSONS);
      status = response.status;
      error = response.error;
      if (status <= 201) {
        let { data } = response.result;
        return thunkAPI.fulfillWithValue({ data, status });
      }
      if (status >= 400) {
        const { message } = error;
        return thunkAPI.rejectWithValue({ message, status });
      }
    } catch (e) {
      throw e;
    }
  }
);
export const boissonsSlice = createSlice({
  name: "boissons",
  initialState: {
    data: [],
    loadingBoissons: false,
    errorBoissons: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBoissons.pending, (state) => {
        if (!state.loadingBoissons) {
          state.loadingBoissons = true;
        }
      })
      .addCase(getBoissons.fulfilled, (state, action) => {
        if (state.loadingBoissons) {
          state.loadingBoissons = false;
        }
      })
      .addCase(getBoissons.rejected, (state, action) => {
        if (state.loadingBoissons) {
          state.loadingBoissons = false;
          state.errorBoissons = action.payload;
        }
      });
  },
});
export default boissonsSlice.reducer;
