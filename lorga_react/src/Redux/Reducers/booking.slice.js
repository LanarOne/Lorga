import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CREATE_BOOKING } from "../../constants/constants";
import { postRequest } from "../../api/api";

export const postNewBooking = createAsyncThunk(
  "booking/create",
  async ({ body, token, userId }, thunkAPI) => {
    let error;
    let status;
    try {
      let url = `${CREATE_BOOKING}${userId}`;
      const response = await postRequest(url, body, token);
      status = response.status;
      error = response.error;
      console.log(response);
    } catch (e) {
      throw e;
    }
  }
);
export const BookingSlice = createSlice({
  name: "booking",
  initialState: {
    date: "",
    time: "",
    description: "",
    nbr_invite: null,
    collectifId: null,
    userId: null,
    loadingBooking: false,
    errorBooking: null,
  },
  reducers: {
    getDate: (state, action) => {
      return { ...state, date: action.payload };
    },
    getTime: (state, action) => {
      return { ...state, time: action.payload };
    },
    getDescription: (state, action) => {
      return { ...state, description: action.payload };
    },
    getNbrInvite: (state, action) => {
      return { ...state, nbr_invite: action.payload };
    },
    getCollectifId: (state, action) => {
      return { ...state, collectifId: action.payload };
    },
    getUserId: (state, action) => {
      return { ...state, userId: action.payload };
    },
  },
});

export const {
  getCollectifId,
  getDate,
  getDescription,
  getNbrInvite,
  getTime,
  getUserId,
} = BookingSlice.actions;
export default BookingSlice.reducer;
