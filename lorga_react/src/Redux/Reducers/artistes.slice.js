import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api/api";
import {
  GET_ARTISTES,
  GET_UNCONFIRMED_ARTISTES,
} from "../../constants/constants";

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

export const getUnconfirmedArtistes = createAsyncThunk(
  "artistes/getUnconfirmed",
  async ({ token }, thunkAPI) => {
    let status;
    let error;
    try {
      const response = await getRequest(GET_UNCONFIRMED_ARTISTES, token);
      status = response.status;
      error = response.error;
      if (status === 200) {
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

export const artisteSlice = createSlice({
  name: "artistes",
  initialState: {
    data: [],
    loadingArtistes: false,
    errorArtistes: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getArtistes.pending, (state, action) => {
      if (!state.loadingArtistes) {
        state.loadingArtistes = true;
      }
    });
    builder.addCase(getArtistes.fulfilled, (state, action) => {
      if (state.loadingArtistes) {
        state.data = action.payload;
        state.loadingArtistes = false;
      }
    });
    builder.addCase(getArtistes.rejected, (state, action) => {
      if (state.loadingArtistes) {
        state.loadingArtistes = false;
        state.errorArtistes = action.payload;
      }
    });
    builder
      .addCase(getUnconfirmedArtistes.pending, (state) => {
        if (!state.loadingArtistes) {
          state.loadingArtistes = true;
        }
      })
      .addCase(getUnconfirmedArtistes.fulfilled, (state, action) => {
        if (state.loadingArtistes) {
          state.data = action.payload;
          state.loadingArtistes = false;
        }
      })
      .addCase(getUnconfirmedArtistes.rejected, (state, action) => {
        if (state.loadingArtistes) {
          state.loadingArtistes = false;
          state.errorArtistes = action.payload;
        }
      });
  },
});
export default artisteSlice.reducer;
