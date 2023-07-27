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
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBookings.pending, (state, action) => {
      if (state.loading === false) {
        state.loading = true;
      }
    });
    builder.addCase(getBookings.fulfilled, (state, action) => {
      if (state.loading === true) {
        state.data = action.payload;
        state.loading = false;
      }
    });
    builder.addCase(getBookings.rejected, (state, action) => {
      if (state.loading === true) {
        state.loading = false;
        state.error = action.payload;
      }
    });
  },
});

export default bookingSlice.reducer;
