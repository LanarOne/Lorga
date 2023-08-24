import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api/api";
import { GET_BOOKINGS } from "../../constants/constants";

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
export const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    data: [],
    loadingBooking: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBookings.pending, (state, action) => {
      if (state.loadingBooking === false) {
        state.loadingBooking = true;
      }
    });
    builder.addCase(getBookings.fulfilled, (state, action) => {
      if (state.loadingBooking === true) {
        state.data = action.payload;
        state.loadingBooking = false;
      }
    });
    builder.addCase(getBookings.rejected, (state, action) => {
      if (state.loadingBooking === true) {
        state.loadingBooking = false;
        state.error = action.payload;
      }
    });
  },
});

export default bookingSlice.reducer;
