import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_LIENS_BY_ART, GET_LIENS_BY_COL } from "../../constants/constants";
import { getRequest } from "../../api/api";

export const getLiensByCollectif = createAsyncThunk(
  "liens/getbycollectif",
  async ({ collectifId, token }, thunkAPI) => {
    let error;
    let status;
    const url = `${GET_LIENS_BY_COL}${collectifId}`;
    const response = await getRequest(url, token);
    status = response.status;
    error = response.error;
    if (status === 200) {
      let { data } = response.result;
      return thunkAPI.fulfillWithValue({ data, status });
    }
    if (status >= 400 || error) {
      return thunkAPI.rejectWithValue({ error, status });
    }
  }
);
export const getLiensByArtiste = createAsyncThunk(
  "liens/getbyartiste",
  async ({ artisteId, token }, thunkAPI) => {
    let error;
    let status;
    const url = `${GET_LIENS_BY_ART}${artisteId}`;
    const response = await getRequest(url, token);
    status = response.status;
    error = response.error;
    if (status === 200) {
      let { data } = response.result;
      return thunkAPI.fulfillWithValue({ data, status });
    }
    if (status >= 400 || error) {
      return thunkAPI.rejectWithValue({ error, status });
    }
  }
);
export const liensSlice = createSlice({
  name: "liens",
  initialState: {
    data: [],
    loadingLiens: false,
    errorLiens: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLiensByCollectif.pending, (state) => {
        if (!state.loadingLiens) {
          state.loadingLiens = true;
        }
      })
      .addCase(getLiensByCollectif.fulfilled, (state, action) => {
        if (state.loadingLiens) {
          state.data = action.payload;
          state.loadingLiens = false;
        }
      })
      .addCase(getLiensByCollectif.rejected, (state, action) => {
        if (state.loadingLiens) {
          state.error = action.payload;
          state.loadingLiens = false;
        }
      });
    builder
      .addCase(getLiensByArtiste.pending, (state) => {
        if (!state.loadingLiens) {
          state.loadingLiens = true;
        }
      })
      .addCase(getLiensByArtiste.fulfilled, (state, action) => {
        if (state.loadingLiens) {
          state.data = action.payload;
          state.loadingLiens = false;
        }
      })
      .addCase(getLiensByArtiste.rejected, (state, action) => {
        if (state.loadingLiens) {
          state.error = action.payload;
          state.loadingLiens = false;
        }
      });
  },
});

export default liensSlice.reducer;
