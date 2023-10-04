import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_SETLIST_BY_BOOKING } from "../../constants/constants";
import { getRequest } from "../../api/api";

export const getSetlistByBookingId = createAsyncThunk(
  "setlists/getbybooking",
  async ({ bookingId }, thunkAPI) => {
    let error;
    let status;
    try {
      const url = `${GET_SETLIST_BY_BOOKING}${bookingId}`;
      const response = await getRequest(url);
      status = response.status;
      error = response.error;
      if (status === 200) {
        const { data } = response.result;
        const { message } = response.result;
        return thunkAPI.fulfillWithValue({ data, message, status });
      }
      if (status >= 400) {
        return thunkAPI.rejectWithValue({ error, status });
      }
    } catch (e) {
      throw e;
    }
  }
);
export const setlistsSlice = createSlice({
  name: "setlists",
  initialState: { data: [], loadingSetlists: false, errorSetlist: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSetlistByBookingId.pending, (state) => {
        if (!state.loadingSetlists) {
          state.loadingSetlists = true;
        }
      })
      .addCase(getSetlistByBookingId.fulfilled, (state, action) => {
        if (state.loadingSetlists) {
          state.data = action.payload;
          state.loadingSetlists = false;
        }
      })
      .addCase(getSetlistByBookingId.rejected, (state, action) => {
        if (state.loadingSetlists) {
          state.errorSetlist = action.payload;
          state.loadingSetlists = false;
        }
      });
  },
});
export default setlistsSlice.reducer;
