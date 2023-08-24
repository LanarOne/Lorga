import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api/api";
import { GET_ARTISTES } from "../../constants/constants";

export const getArtistes = createAsyncThunk(
  "artistes/get",
  async (_, { rejectWithValue }) => {
    let error;
    let status;
    try {
      const response = await getRequest(GET_ARTISTES);
      status = response.status;
      error = response.error;
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
    loadingArtiste: false,
    errorArtiste: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getArtistes.pending, (state, action) => {
      if (!state.loadingArtiste) {
        state.loadingArtiste = true;
      }
    });
    builder.addCase(getArtistes.fulfilled, (state, action) => {
      if (state.loadingArtiste) {
        state.data = action.payload;
        state.loadingArtiste = false;
      }
    });
    builder.addCase(getArtistes.rejected, (state, action) => {
      if (state.loadingArtiste) {
        state.loadingArtiste = false;
        state.errorArtiste = action.payload;
      }
    });
  },
});
export default artisteSlice.reducer;
