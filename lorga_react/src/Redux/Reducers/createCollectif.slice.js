import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CREATE_COLLECTIF,
  GET_COLLECTIF_BY_NOM,
} from "../../constants/constants";
import { getRequest, postRequest } from "../../api/api";

export const postNewCollectif = createAsyncThunk(
  "collectif/create",
  async ({ body, token }) => {
    try {
      let url = `${CREATE_COLLECTIF}${body.userId}`;
      const response = await postRequest(url, body, token);
      const status = response.status;
      if (status <= 201) {
        return response;
      }
      if (status >= 400) {
        throw new Error(response.error.message);
      }
    } catch (e) {
      throw new Error(e.message);
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
export const createCollectifSlice = createSlice({
  name: "collectif",
  initialState: {
    nom: "",
    description: "",
    influences: "",
    style: "",
    photoId: "",
    userId: "",
    loading: false,
    error: null,
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
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(postNewCollectif.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = action.payload;
          state.loading = false;
        }
      })
      .addCase(postNewCollectif.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.payload;
        }
      });
    builder
      .addCase(getCollectifByName.pending, (state) => {
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(getCollectifByName.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = action.payload;
          state.loading = false;
        }
      })
      .addCase(getCollectifByName.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.payload;
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
