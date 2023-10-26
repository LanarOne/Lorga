import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest } from "../../api/api";
import { CREATE_LIEN } from "../../constants/constants";

export const postNewLien = createAsyncThunk(
  "lien/create",
  async ({ body, token }, thunkAPI) => {
    let error;
    let status;
    const response = await postRequest(CREATE_LIEN, body, token);
    status = response.status;
    error = response.error;
    if (status === 201) {
      const { data } = response.result;
      return thunkAPI.fulfillWithValue({ data, status });
    }
    if (status >= 400) {
      return thunkAPI.rejectWithValue({ error, status });
    }
  }
);

export const lienSlice = createSlice({
  name: "lien",
  initialState: {
    url: "",
    artisteId: null,
    collectifId: null,
    loadingLien: false,
    errorLien: null,
  },
  reducers: {
    getUrl: (state, action) => {
      return { ...state, url: action.payload };
    },
    getArtisteId: (state, action) => {
      return { ...state, artisteId: action.payload };
    },
    getCollectifId: (state, action) => {
      return { ...state, collectifId: action.payload };
    },
  },
});

export const { getArtisteId, getCollectifId, getUrl } = lienSlice.actions;
export default lienSlice.reducer;
