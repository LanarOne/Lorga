import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api/api";
import { GET_BOOKINGS } from "../../constants/constants";

export const getBookings = createAsyncThunk(
  "bookings/getBookings",
  async () => {
    const response = await getRequest(GET_BOOKINGS);
    let error = response.error;
    let status = response.status;
    return { data: response.result.data, status, error };
  }
);
export const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    data: [],
    loading: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBookings.pending, (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    });
    builder.addCase(getBookings.fulfilled, (state, action) => {
      if (state.loading === "pending") {
        state.data = action.payload.data;
        state.loading = "idle";
      }
    });
    builder.addCase(getBookings.rejected, (state, action) => {
      if (state.loading === "pending") {
        state.loading = "idle";
        state.error = action.payload.data.error;
      }
    });
  },
});

export default bookingSlice.reducer;
