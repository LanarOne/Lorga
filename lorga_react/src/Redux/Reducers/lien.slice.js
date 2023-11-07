import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteRequest, postRequest, putRequest } from "../../api/api";
import { CREATE_LIEN, DELETE_LIEN, PUT_LIEN } from "../../constants/constants";

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
export const updateLien = createAsyncThunk(
  "lien/update",
  async ({ id, body, token }, thunkAPI) => {
    let status;
    let error;
    let url = `${PUT_LIEN}${id}`;
    const response = await putRequest(url, body, token);
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
  }
);
export const deleteLien = createAsyncThunk(
  "lien/delete",
  async ({ id, token }, thunkAPI) => {
    let error;
    let status;
    let url = `${DELETE_LIEN}${id}`;
    const response = await deleteRequest(url, token);
    status = response.status;
    error = response.error;
    if (status === 200) {
      const message = response.result.data;
      return thunkAPI.fulfillWithValue({ message, status });
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
  extraReducers: (builder) => {
    builder
      .addCase(postNewLien.pending, (state) => {
        if (!state.loadingLien) {
          state.loadingLien = true;
        }
      })
      .addCase(postNewLien.fulfilled, (state, action) => {
        if (state.loadingLien) {
          state.data = action.payload;
          state.loadingLien = false;
        }
      })
      .addCase(postNewLien.rejected, (state, action) => {
        if (state.loadingLien) {
          state.error = action.payload;
          state.loadingLien = false;
        }
      });
    builder
      .addCase(updateLien.pending, (state) => {
        if (!state.loadingLien) {
          state.loadingLien = true;
        }
      })
      .addCase(updateLien.fulfilled, (state, action) => {
        if (state.loadingLien) {
          state.data = action.payload;
          state.loadingLien = false;
        }
      })
      .addCase(updateLien.rejected, (state, action) => {
        if (state.loadingLien) {
          state.error = action.payload;
          state.loadingLien = false;
        }
      });
    builder
      .addCase(deleteLien.pending, (state) => {
        if (!state.loadingLien) {
          state.loadingLien = true;
        }
      })
      .addCase(deleteLien.fulfilled, (state, action) => {
        if (state.loadingLien) {
          state.data = action.payload;
          state.loadingLien = false;
        }
      })
      .addCase(deleteLien.rejected, (state, action) => {
        if (state.loadingLien) {
          state.error = action.payload;
          state.loadingLien = false;
        }
      });
  },
});

export const { getArtisteId, getCollectifId, getUrl } = lienSlice.actions;
export default lienSlice.reducer;
