import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest } from "../../api/api";
import { CREATE_ARTISTE } from "../../constants/constants";

export const postNewArtiste = createAsyncThunk(
  "artiste/create",
  async ({ body }) => {
    try {
      console.log(body);
      let url = `${CREATE_ARTISTE}${body.userId}`;
      const response = await postRequest(url, body);
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
