import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CONFIRM_COLLECTIF,
  CREATE_COLLECTIF,
  DELETE_COLLECTIF,
  GET_COL_BY_ID,
  GET_COLLECTIF_BY_CREATEUR,
  GET_COLLECTIF_BY_NOM,
  PUT_COLLECTIF,
} from "../../constants/constants";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../api/api";

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
        let { data, message } = response.result;
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
      if (status >= 400 || error) {
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

export const getCollectifById = createAsyncThunk(
  "collectif/getonebyid",
  async ({ id, token }, thunkAPI) => {
    let error;
    let status;
    try {
      let url = `${GET_COL_BY_ID}${id}`;
      const response = await getRequest(url, token);
      status = response.status;
      error = response.error;
      if (status >= 400 || error) {
        let { message } = error;
        return thunkAPI.rejectWithValue({ message, status });
      }
      if (status <= 201) {
        const { data } = response.result;
        return thunkAPI.fulfillWithValue({ data, status });
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
        return thunkAPI.rejectWithValue({ message, status });
      }
    } catch (e) {
      throw e;
    }
  }
);

export const confirmCollectif = createAsyncThunk(
  "collectif/confirmation",
  async ({ id, token }, thunkAPI) => {
    let error;
    let status;
    try {
      let url = `${CONFIRM_COLLECTIF}${id}`;
      let body = {};
      const response = await putRequest(url, body, token);
      status = response.status;
      error = response.error || null;
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

export const deleteCollectif = createAsyncThunk(
  "collectif/delete",
  async ({ id, token }, thunkAPI) => {
    let error;
    let status;
    try {
      let url = `${DELETE_COLLECTIF}${id}`;
      const response = await deleteRequest(url, token);
      status = response.status;
      error = response.error || null;
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
          state.data = action.payload;
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
          state.data = action.payload;
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
    builder
      .addCase(getCollectifByCreateur.pending, (state) => {
        if (!state.loadingCollectif) {
          state.loadingCollectif = true;
        }
      })
      .addCase(getCollectifByCreateur.fulfilled, (state, action) => {
        if (state.loadingCollectif) {
          state.data = action.payload;
          state.loadingCollectif = false;
        }
      })
      .addCase(getCollectifByCreateur.rejected, (state, action) => {
        if (state.loadingCollectif) {
          state.loadingCollectif = false;
          state.errorCollectif = action.payload;
          state.status = action.payload;
        }
      });
    builder
      .addCase(updateCollectif.pending, (state) => {
        if (!state.loadingCollectif) {
          state.loadingCollectif = true;
        }
      })
      .addCase(updateCollectif.fulfilled, (state, action) => {
        if (state.loadingCollectif) {
          state.data = action.payload;
          state.loadingCollectif = false;
        }
      })
      .addCase(updateCollectif.rejected, (state, action) => {
        if (state.loadingCollectif) {
          state.loadingCollectif = false;
          state.errorCollectif = action.payload;
          state.status = action.payload;
        }
      });
    builder
      .addCase(getCollectifById.pending, (state) => {
        if (!state.loadingCollectif) {
          state.loadingCollectif = true;
        }
      })
      .addCase(getCollectifById.fulfilled, (state, action) => {
        if (state.loadingCollectif) {
          state.data = action.payload;
          state.loadingCollectif = false;
        }
      })
      .addCase(getCollectifById.rejected, (state, action) => {
        if (state.loadingCollectif) {
          state.loadingCollectif = false;
          state.errorCollectif = action.payload;
          state.status = action.payload;
        }
      });
    builder
      .addCase(confirmCollectif.pending, (state) => {
        if (!state.loadingCollectif) {
          state.loadingCollectif = true;
        }
      })
      .addCase(confirmCollectif.fulfilled, (state, action) => {
        if (state.loadingCollectif) {
          state.data = action.payload;
          state.loadingCollectif = false;
        }
      })
      .addCase(confirmCollectif.rejected, (state, action) => {
        if (state.loadingCollectif) {
          state.loadingCollectif = false;
          state.errorCollectif = action.payload;
          state.status = action.payload;
        }
      });
    builder
      .addCase(deleteCollectif.pending, (state) => {
        if (!state.loadingCollectif) {
          state.loadingCollectif = true;
        }
      })
      .addCase(deleteCollectif.fulfilled, (state, action) => {
        if (state.loadingCollectif) {
          state.data = action.payload;
          state.loadingCollectif = false;
        }
      })
      .addCase(deleteCollectif.rejected, (state, action) => {
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
