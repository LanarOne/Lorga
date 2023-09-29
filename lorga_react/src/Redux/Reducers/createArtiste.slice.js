import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, postRequest, putRequest } from "../../api/api";
import {
  CONFIRM_ARTISTE,
  CREATE_ARTISTE,
  GET_ARTISTE_BY_ID,
  GET_ARTISTE_BY_NOM,
  PUT_ARTISTE,
} from "../../constants/constants";

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

export const confirmArtiste = createAsyncThunk(
  "artiste/confirmation",
  async ({ artisteId, body, token }, thunkAPI) => {
    let error;
    let status;
    try {
      const url = `${CONFIRM_ARTISTE}${artisteId}`;
      const body = {};
      const response = await putRequest(url, body, token);
      status = response.status;
      error = response.error;
      if (status === 200) {
        let { data } = response.result;
        let { message } = response.result;
        return thunkAPI.fulfillWithValue({ data, message, status });
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

export const getArtisteById = createAsyncThunk(
  "artiste/getOneById",
  async ({ artisteId, token }, thunkAPI) => {
    let status;
    let error;
    try {
      const url = `${GET_ARTISTE_BY_ID}${artisteId}`;
      const response = await getRequest(url, token);
      status = response.status;
      error = response.error;
      if (status === 200) {
        let { data } = response.result;
        return thunkAPI.fulfillWithValue({ data, status });
      }
      if (status >= 400 || error) {
        const { message } = error;
        return thunkAPI.rejectWithValue({ message, status });
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
  async ({ artisteId, body, token }, thunkAPI) => {
    let error;
    let status;

    try {
      let url = `${PUT_ARTISTE}${artisteId}`;
      const response = await putRequest(url, body, token);
      status = response.status;
      if (status <= 201) {
        let { data } = response.result;
        return { data, status };
      }
      if (status >= 400) {
        let { message } = response.error;
        return thunkAPI.rejectWithValue({ message, status });
      }
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
    loadingArtiste: false,
    errorArtiste: null,
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
      if (!state.loadingArtiste) {
        state.loadingArtiste = true;
      }
    });
    builder.addCase(postNewArtiste.fulfilled, (state, action) => {
      if (state.loadingArtiste) {
        state.data = action.payload;
        state.loadingArtiste = false;
      }
    });
    builder.addCase(postNewArtiste.rejected, (state, action) => {
      if (state.loadingArtiste) {
        state.loadingArtiste = false;
        state.errorArtiste = action.payload;
      }
    });
    builder.addCase(getArtisteByName.pending, (state, action) => {
      if (!state.loadingArtiste) {
        state.loadingArtiste = true;
      }
    });
    builder.addCase(getArtisteByName.fulfilled, (state, action) => {
      if (state.loadingArtiste) {
        state.data = action.payload;
        state.loadingArtiste = false;
      }
    });
    builder.addCase(getArtisteByName.rejected, (state, action) => {
      if (state.loadingArtiste) {
        state.loadingArtiste = false;
        state.errorArtiste = action.payload;
      }
    });
    builder
      .addCase(confirmArtiste.pending, (state) => {
        if (!state.loadingArtiste) {
          state.loadingArtiste = true;
        }
      })
      .addCase(confirmArtiste.fulfilled, (state, action) => {
        if (state.loadingArtiste) {
          state.data = action.payload;
          state.loadingArtiste = false;
        }
      })
      .addCase(confirmArtiste.rejected, (state, action) => {
        if (state.loadingArtiste) {
          state.loadingArtiste = false;
          state.errorArtiste = action.payload;
        }
      });
    builder
      .addCase(updateArtiste.pending, (state) => {
        if (!state.loadingArtiste) {
          state.loadingArtiste = true;
        }
      })
      .addCase(updateArtiste.fulfilled, (state, action) => {
        if (state.loadingArtiste) {
          state.data = action.payload;
          state.loadingArtiste = false;
        }
      })
      .addCase(updateArtiste.rejected, (state, action) => {
        if (state.loadingArtiste) {
          state.loadingArtiste = false;
          state.errorArtiste = action.payload;
        }
      });
    builder
      .addCase(getArtisteById.pending, (state) => {
        if (!state.loadingArtiste) {
          state.loadingArtiste = true;
        }
      })
      .addCase(getArtisteById.fulfilled, (state, action) => {
        if (state.loadingArtiste) {
          state.data = action.payload;
          state.loadingArtiste = false;
        }
      })
      .addCase(getArtisteById.rejected, (state, action) => {
        if (state.loadingArtiste) {
          state.loadingArtiste = false;
          state.errorArtiste = action.payload;
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
