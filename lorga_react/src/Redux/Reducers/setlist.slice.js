import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CREATE_SETLIST, DELETE_SETLIST } from "../../constants/constants";
import { deleteRequest, postRequest } from "../../api/api";

export const postSetlist = createAsyncThunk(
  "setlist/create",
  async ({ artisteId, bookingId, token }, thunkAPI) => {
    let error;
    let status;
    try {
      const url = `${CREATE_SETLIST}${artisteId}`;
      const body = { bookingId };
      const response = await postRequest(url, body, token);
      status = response.status;
      error = response.error;
      if (status === 201) {
        let { data } = response.result;
        let { message } = response.result;
        return thunkAPI.fulfillWithValue({ data, message, status });
      }
      if (status >= 400) {
        console.error(response);
        return thunkAPI.rejectWithValue({ error, status });
      }
    } catch (e) {
      throw e;
    }
  }
);

export const deleteSetlist = createAsyncThunk(
  "setlist/delete",
  async ({ id, token }, thunkAPI) => {
    let error;
    let status;
    try {
      const url = `${DELETE_SETLIST}${id}`;
      const response = await deleteRequest(url, token);
      status = response.status;
      error = response.error;
      if (status === 200) {
        let { message } = response.result;
        return thunkAPI.fulfillWithValue({ message, status });
      }
      if (status >= 400) {
        return thunkAPI.rejectWithValue({ error, status });
      }
    } catch (e) {
      throw e;
    }
  }
);

export const SetlistSlice = createSlice({
  name: "setlist",
  initialState: {
    artisteId: null,
    bookingId: null,
    loadingSetlist: false,
    errorSetlist: null,
  },
  reducers: {
    getArtisteId: (state, action) => {
      return { ...state, artisteId: action.payload };
    },
    getBookingId: (state, action) => {
      return { ...state, bookingId: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postSetlist.pending, (state) => {
        if (!state.loadingSetlist) {
          state.loadingSetlist = true;
        }
      })
      .addCase(postSetlist.fulfilled, (state, action) => {
        if (state.loadingSetlist) {
          state.data = action.payload;
          state.loadingSetlist = false;
        }
      })
      .addCase(postSetlist.rejected, (state, action) => {
        if (state.loadingSetlist) {
          state.errorSetlist = action.payload;
          state.loadingSetlist = false;
        }
      });
    builder
      .addCase(deleteSetlist.pending, (state) => {
        if (!state.loadingSetlist) {
          state.loadingSetlist = true;
        }
      })
      .addCase(deleteSetlist.fulfilled, (state, action) => {
        if (state.loadingSetlist) {
          state.data = action.payload;
          state.loadingSetlist = false;
        }
      })
      .addCase(deleteSetlist.rejected, (state, action) => {
        if (state.loadingSetlist) {
          state.errorSetlist = action.payload;
          state.loadingSetlist = false;
        }
      });
  },
});
export const { getArtisteId, getBookingId } = SetlistSlice.actions;
export default SetlistSlice.reducer;
