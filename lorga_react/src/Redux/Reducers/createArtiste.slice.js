import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, postRequest } from "../../api/api";
import { CREATE_ARTISTE, GET_ARTISTE_BY_NOM } from "../../constants/constants";

export const postNewArtiste = createAsyncThunk(
  "artiste/create",
  async ({ body, token }, { rejectWithValue }) => {
    let error;
    let status;
    try {
      let url = `${CREATE_ARTISTE}${body.userId}`;
      const response = await postRequest(url, body, token);
      status = response.status;
      error = response.error;
      if (status <= 201) {
        return response;
      }
      if (status >= 400 || error) {
        const { message } = response.error;
        return rejectWithValue({ message, status });
      }
    } catch (e) {
      throw e;
    }
  }
);
export const getArtisteByName = createAsyncThunk(
  `artiste/getonebyname`,
  async ({ nom, token }, { rejectWithValue }) => {
    let error;
    let status;
    try {
      let url = `${GET_ARTISTE_BY_NOM}${nom}`;
      const response = await getRequest(url, token);
      status = response.status;
      if (status <= 201) {
        let { data } = response.result;
        return { data, status };
      }
      if (status >= 400 || error) {
        const { message } = response.error;
        return rejectWithValue({ message, status });
      }
    } catch (e) {
      throw e;
    }
  }
);

export const updateArtiste = createAsyncThunk(
  "artiste/update",
  async ({ nom, token }, thunkAPI) => {
    let error;
    let status;
    try {
    } catch (e) {
      throw e;
    }
  }
);
export const createArtisteSlice = createSlice({
  name: "artiste",
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
    builder.addCase(postNewArtiste.pending, (state, action) => {
      if (!state.loading) {
        state.loading = true;
      }
    });
    builder.addCase(postNewArtiste.fulfilled, (state, action) => {
      if (state.loading) {
        state.loading = action.payload;
        state.loading = false;
      }
    });
    builder.addCase(postNewArtiste.rejected, (state, action) => {
      if (state.loading) {
        state.loading = false;
        state.error = action.payload;
      }
    });
    builder.addCase(getArtisteByName.pending, (state, action) => {
      if (!state.loading) {
        state.loading = true;
      }
    });
    builder.addCase(getArtisteByName.fulfilled, (state, action) => {
      if (state.loading) {
        state.loading = action.payload;
        state.loading = false;
      }
    });
    builder.addCase(getArtisteByName.rejected, (state, action) => {
      if (state.loading) {
        state.loading = false;
        state.error = action.payload;
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
} = createArtisteSlice.actions;
export default createArtisteSlice.reducer;
