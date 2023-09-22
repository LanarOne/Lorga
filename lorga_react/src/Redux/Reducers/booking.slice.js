import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CONFIRM_BOOKING,
  CREATE_BOOKING,
  DELETE_BOOKING,
} from "../../constants/constants";
import { deleteRequest, postRequest, putRequest } from "../../api/api";

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
      if (status <= 201) {
        let { data } = response.result;
        return thunkAPI.fulfillWithValue({ data, status });
      }
      if (status >= 400) {
        let { message } = error;
        return thunkAPI.rejectWithValue({ message, status });
      }
    } catch (e) {
      throw e;
    }
  }
);

export const confirmBooking = createAsyncThunk(
  "booking/confirm",
  async ({ id, token }, thunkAPI) => {
    let error;
    let status;
    try {
      let url = `${CONFIRM_BOOKING}${id}`;
      let body = {};
      const response = await putRequest(url, body, token);
      status = response.status;
      error = response.error;
      if (status <= 201) {
        console.log(response);
        let { message } = response.result;
        return thunkAPI.fulfillWithValue({ message, status });
      }
      if (status >= 400 || error) {
        let { message } = error;
        return thunkAPI.rejectWithValue({ message, status });
      }
    } catch (e) {
      throw e;
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "booking/delete",
  async ({ id, token }, thunkAPI) => {
    let error;
    let status;
    try {
      let url = `${DELETE_BOOKING}${id}`;
      const response = await deleteRequest(url, token);
      console.log(response);
      status = response.status;
      error = response.error;
      if (status <= 201) {
        let { message } = response.result;
        return thunkAPI.fulfillWithValue({ message, status });
      }
      if (status >= 400 || error) {
        let { message } = error;
        return thunkAPI.rejectWithValue({ message, status });
      }
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
  extraReducers: (builder) => {
    builder
      .addCase(postNewBooking.pending, (state) => {
        if (!state.loadingBooking) {
          state.loadingBooking = true;
        }
      })
      .addCase(postNewBooking.fulfilled, (state, action) => {
        if (state.loadingBooking) {
          state.data = action.payload;
          state.loadingBooking = false;
        }
      })
      .addCase(postNewBooking.rejected, (state, action) => {
        if (state.loadingBooking) {
          state.errorBooking = action.payload;
          state.loadingBooking = false;
        }
      });
    builder
      .addCase(confirmBooking.pending, (state) => {
        if (!state.loadingBooking) {
          state.loadingBooking = true;
        }
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        if (state.loadingBooking) {
          state.data = action.payload;
          state.loadingBooking = false;
        }
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        if (state.loadingBooking) {
          state.errorBooking = action.payload;
          state.loadingBooking = false;
        }
      });
    builder
      .addCase(deleteBooking.pending, (state) => {
        if (!state.loadingBooking) {
          state.loadingBooking = true;
        }
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        if (state.loadingBooking) {
          state.data = action.payload;
          state.loadingBooking = false;
        }
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        if (state.loadingBooking) {
          state.errorBooking = action.payload;
          state.loadingBooking = false;
        }
      });
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
