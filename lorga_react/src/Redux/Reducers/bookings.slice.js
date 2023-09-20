import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api/api";
import { GET_BOOKINGS, GET_UNCONF_BOOKINGS } from "../../constants/constants";

export const getBookings = createAsyncThunk(
  "bookings/getBookings",
  async () => {
    const response = await getRequest(GET_BOOKINGS);
    let error = response.error;
    let status = response.status;
    if (error) {
      console.error(error, status);
      return { data: status, error };
    }
    return response.result.data;
  }
);

export const getUnconfirmedBookings = createAsyncThunk(
  "bookings/getUnconfirmed",
  async ({ token }, thunkAPI) => {
    let status;
    let error;
    const response = await getRequest(GET_UNCONF_BOOKINGS, token);
    status = response.status;
    error = response.error;
    if (status <= 201) {
      let { data } = response.result;
      return thunkAPI.fulfillWithValue({ data, status });
    }
    if (status >= 400 || error) {
      let { message } = error;
      return thunkAPI.rejectWithValue({ message, status });
    }
  }
);
export const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    data: [],
    loadingBooking: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBookings.pending, (state, action) => {
        if (!state.loadingBooking) {
          state.loadingBooking = true;
        }
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        if (state.loadingBooking) {
          state.data = action.payload;
          state.loadingBooking = false;
        }
      })
      .addCase(getBookings.rejected, (state, action) => {
        if (state.loadingBooking) {
          state.loadingBooking = false;
          state.error = action.payload;
        }
      });
    builder
      .addCase(getUnconfirmedBookings.pending, (state, action) => {
        if (!state.loadingBooking) {
          state.loadingBooking = true;
        }
      })
      .addCase(getUnconfirmedBookings.fulfilled, (state, action) => {
        if (state.loadingBooking) {
          state.data = action.payload;
          state.loadingBooking = false;
        }
      })
      .addCase(getUnconfirmedBookings.rejected, (state, action) => {
        if (state.loadingBooking) {
          state.loadingBooking = false;
          state.error = action.payload;
        }
      });
  },
});

export default bookingSlice.reducer;
