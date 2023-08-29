import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest } from "../../api/api";
import { CREATE_BOISSON } from "../../constants/constants";

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
