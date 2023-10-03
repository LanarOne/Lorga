import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CREATE_SETLIST } from "../../constants/constants";
import { postRequest } from "../../api/api";

export const postSetlist = createAsyncThunk(
  "setlist/create",
  async ({ artisteId, body, token }, thunkAPI) => {
    let error;
    let status;
    try {
      const url = `${CREATE_SETLIST}${artisteId}`;
      const response = await postRequest(url, body, token);
      status = response.status;
      error = response.error;
      if (status === 201) {
        console.log(response);
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
});
export const { getArtisteId, getBookingId } = SetlistSlice.actions;
export default SetlistSlice.reducer;
