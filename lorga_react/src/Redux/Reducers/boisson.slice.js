import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../api/api";
import {
  CREATE_BOISSON,
  DELETE_BOISSON,
  GET_BOISSONS,
  GET_ONE_BOISSON,
  PUT_BOISSON,
} from "../../constants/constants";

export const postNewBoisson = createAsyncThunk(
  "boisson/create",
  async ({ body, token }, thunkAPI) => {
    let error;
    let status;
    try {
      const response = await postRequest(CREATE_BOISSON, body, token);
      status = response.status;
      error = response.error;
      if (status >= 400) {
        return thunkAPI.rejectWithValue({ status, error });
      }
      if (status <= 201) {
        console.log(response);
        const data = response.result.data;
        return thunkAPI.fulfillWithValue({ data, status });
      }
    } catch (e) {
      throw e;
    }
  }
);

export const getOneBoisson = createAsyncThunk(
  "boisson/get",
  async ({ id, token }, thunkAPI) => {
    let error;
    let status;
    try {
      let url = `${GET_ONE_BOISSON}${id}`;
      const response = await getRequest(url, token);
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

export const updateBoisson = createAsyncThunk(
  "boisson/update",
  async ({ id, body, token }, thunkAPI) => {
    let error;
    let status;
    try {
      let url = `${PUT_BOISSON}${id}`;
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

export const deleteBoisson = createAsyncThunk(
  "boisson/delete",
  async ({ id, token }, thunkAPI) => {
    let error;
    let status;
    try {
      let url = `${DELETE_BOISSON}${id}`;
      const response = await deleteRequest(url, token);
      console.log(response);
      status = response.status;
      error = response.error;
      if (status <= 201) {
        let message = response.result.data;
        return thunkAPI.fulfillWithValue({ message, status });
      }
      if (status >= 400 || error) {
        return thunkAPI.rejectWithValue({ error, status });
      }
    } catch (e) {
      throw e;
    }
  }
);
export const boissonSlice = createSlice({
  name: "boisson",
  initialState: {
    nom: "",
    famille: "",
    type: "",
    description: "",
    recette: "",
    saveurs: "",
    photoId: null,
    loadingBoisson: false,
    errorBoisson: null,
  },
  reducers: {
    getNom: (state, action) => {
      return { ...state, nom: action.payload };
    },
    getFamille: (state, action) => {
      return { ...state, famille: action.payload };
    },
    getType: (state, action) => {
      return { ...state, type: action.payload };
    },
    getDescription: (state, action) => {
      return { ...state, description: action.payload };
    },
    getRecette: (state, action) => {
      return { ...state, recette: action.payload };
    },
    getSaveurs: (state, action) => {
      return { ...state, saveurs: action.payload };
    },
    getPhotoId: (state, action) => {
      return { ...state, photoId: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postNewBoisson.pending, (state) => {
        if (!state.loadingBoisson) {
          state.loadingBoisson = true;
        }
      })
      .addCase(postNewBoisson.fulfilled, (state, action) => {
        if (state.loadingBoisson) {
          state.loadingBoisson = false;
        }
      })
      .addCase(postNewBoisson.rejected, (state, action) => {
        if (state.loadingBoisson) {
          state.loadingBoisson = false;
          state.errorBoisson = action.payload;
        }
      });
    builder
      .addCase(updateBoisson.pending, (state) => {
        if (!state.loadingBoisson) {
          state.loadingBoisson = true;
        }
      })
      .addCase(updateBoisson.fulfilled, (state, action) => {
        if (state.loadingBoisson) {
          state.loadingBoisson = false;
        }
      })
      .addCase(updateBoisson.rejected, (state, action) => {
        if (state.loadingBoisson) {
          state.loadingBoisson = false;
          state.errorBoisson = action.payload;
        }
      });
  },
});
export const {
  getDescription,
  getFamille,
  getNom,
  getRecette,
  getSaveurs,
  getType,
  getPhotoId,
} = boissonSlice.actions;

export default boissonSlice.reducer;
