import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CREATE_COLLECTIF,
  GET_COLLECTIF_BY_CREATEUR,
  GET_COLLECTIF_BY_NOM,
  PUT_COLLECTIF,
} from "../../constants/constants";
import { getRequest, postRequest, putRequest } from "../../api/api";

export const postNewCollectif = createAsyncThunk(
  "collectif/create",
  async ({ body, token }, thunkAPI) => {
    try {
      let url = `${CREATE_COLLECTIF}${body.userId}`;
      const response = await postRequest(url, body, token);
      const status = response.status;
      const error = response.error;
      if (status <= 201) {
        return response;
      }
      if (status >= 400) {
        return thunkAPI.rejectWithValue({ error, status });
      }
    } catch (e) {
      throw e;
    }
  }
);

export const updateCollectif = createAsyncThunk(
  "collectif/update",
  async ({ collectifId, body, token }, thunkAPI) => {
    let error;
    let status;

    try {
      let url = `${PUT_COLLECTIF}${collectifId}`;
      const response = await putRequest(url, body, token);
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
    } catch (e) {
      throw e;
    }
  }
);

export const getCollectifByName = createAsyncThunk(
  "collectif/getonebyname",
  async ({ nom, token }, { rejectWithValue }) => {
    let error;
    let status;
    try {
      let url = `${GET_COLLECTIF_BY_NOM}${nom}`;
      const response = await getRequest(url, token);
      status = response.status;
      error = response.error;
      if (error) {
        let { message } = error;
        throw rejectWithValue({ message, status });
      }
      if (status <= 201) {
        return response;
      }
    } catch (e) {
      throw e;
    }
  }
);

export const getCollectifByCreateur = createAsyncThunk(
  "collectif/getbycreateur",
  async ({ userId, token }, thunkAPI) => {
    let error;
    let status;
    try {
      let url = `${GET_COLLECTIF_BY_CREATEUR}${userId}`;
      const response = await getRequest(url, token);
      status = response.status;
      error = response.error;
      if (status <= 201) {
        return response;
      }
      if (status >= 400 || error) {
        let { message } = error;
        throw thunkAPI.rejectWithValue({ message, status });
      }
    } catch (e) {
      throw e;
    }
  }
);
export const createCollectifSlice = createSlice({
  name: "collectif",
  initialState: {
    nom: "",
    description: "",
    influences: "",
    style: "",
    photoId: "",
    userId: "",
    loadingCollectif: false,
    errorCollectif: null,
  },
  reducers: {
    getNom: (state, action) => {
      return { ...state, nom: action.payload };
    },
    getDescription: (state, action) => {
      return { ...state, description: action.payload };
    },
    getInfluences: (state, action) => {
      return { ...state, influences: action.payload };
    },
    getStyle: (state, action) => {
      return { ...state, style: action.payload };
    },
    getPhotoId: (state, action) => {
      return { ...state, photoId: action.payload };
    },
    getUserId: (state, action) => {
      return { ...state, userId: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postNewCollectif.pending, (state) => {
        if (!state.loadingCollectif) {
          state.loadingCollectif = true;
        }
      })
      .addCase(postNewCollectif.fulfilled, (state, action) => {
        if (state.loadingCollectif) {
          state.loadingCollectif = false;
        }
      })
      .addCase(postNewCollectif.rejected, (state, action) => {
        if (state.loadingCollectif) {
          state.loadingCollectif = false;
          state.errorCollectif = action.payload;
        }
      });
    builder
      .addCase(getCollectifByName.pending, (state) => {
        if (!state.loadingCollectif) {
          state.loadingCollectif = true;
        }
      })
      .addCase(getCollectifByName.fulfilled, (state, action) => {
        if (state.loadingCollectif) {
          state.loadingCollectif = false;
        }
      })
      .addCase(getCollectifByName.rejected, (state, action) => {
        if (state.loadingCollectif) {
          state.loadingCollectif = false;
          state.errorCollectif = action.payload;
          state.status = action.payload;
        }
      });
  },
});

export const {
  getNom,
  getDescription,
  getInfluences,
  getStyle,
  getPhotoId,
  getUserId,
} = createCollectifSlice.actions;
export default createCollectifSlice.reducer;
