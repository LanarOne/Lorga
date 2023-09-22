import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteRequest,
  getRequest,
  postFileRequest,
  putFileRequest,
} from "../../api/api";
import {
  CREATE_PHOTO,
  DELETE_PHOTO,
  GET_PHOTO_BY_ID,
  PUT_PHOTO,
} from "../../constants/constants";

export const postPhoto = createAsyncThunk(
  "photo/create",
  async ({ image, token }, { rejectWithValue }) => {
    let error;
    let status;
    try {
      const formData = new FormData();
      let alt = `ntm`;
      formData.append("image", image);
      formData.append("alt", alt);
      const response = await postFileRequest(CREATE_PHOTO, formData, token);
      status = response.status;
      error = response.error;
      if (status >= 400 || error) {
        const { message } = response.error;
        return rejectWithValue({ message, status });
      }
      if (status <= 201) {
        return response;
      }
    } catch (e) {
      throw e;
    }
  }
);
export const updatePhoto = createAsyncThunk(
  "photo/put",
  async ({ image, token, photoId }, thunkAPI) => {
    let error;
    let status;
    try {
      const formData = new FormData();
      let alt = `ntm`;
      formData.append("image", image);
      formData.append("alt", alt);
      const url = `${PUT_PHOTO}${photoId}`;
      const response = await putFileRequest(url, formData, token);
      status = response.status;
      error = response.error;
      if (status >= 400 || error) {
        const { message } = error;
        return thunkAPI.rejectWithValue({ message, status });
      }
      if (status <= 201) {
        let { data } = response.result;
        return thunkAPI.fulfillWithValue({ data, status });
      }
    } catch (e) {
      throw e;
    }
  }
);
export const getPhoto = createAsyncThunk(
  "photo/get",
  async ({ photoId, token }, { rejectWithValue }) => {
    let error;
    let status;
    let url = `${GET_PHOTO_BY_ID}${photoId}`;
    try {
      const response = await getRequest(url, token);
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

export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async ({ photoId, token }, thunkAPI) => {
    let status;
    let error;
    try {
      let url = `${DELETE_PHOTO}${photoId}`;
      const response = await deleteRequest(url, token);
      status = response.status;
      error = response.error;
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

export const photoSlice = createSlice({
  name: "photo",
  initialState: {
    alt: "",
    image: null,
    loadingPhoto: false,
    errorPhoto: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postPhoto.pending, (state, action) => {
      if (!state.loadingPhoto) {
        state.loadingPhoto = true;
      }
    });
    builder.addCase(postPhoto.fulfilled, (state, action) => {
      if (state.loadingPhoto) {
        state.data = action.payload;
        state.loadingPhoto = false;
      }
    });
    builder.addCase(postPhoto.rejected, (state, action) => {
      if (state.loadingPhoto) {
        state.loadingPhoto = false;
        state.errorPhoto = action.payload;
      }
    });
    builder
      .addCase(getPhoto.pending, (state) => {
        if (!state.loadingPhoto) {
          state.loadingPhoto = true;
        }
      })
      .addCase(getPhoto.fulfilled, (state, action) => {
        if (state.loadingPhoto) {
          state.data = action.payload;
          state.loadingPhoto = false;
        }
      })
      .addCase(getPhoto.rejected, (state, action) => {
        if (state.loadingPhoto) {
          state.loadingPhoto = false;
          state.errorPhoto = action.payload;
        }
      });
    builder
      .addCase(updatePhoto.pending, (state) => {
        if (!state.loadingPhoto) {
          state.loadingPhoto = true;
        }
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        if (state.loadingPhoto) {
          state.data = action.payload;
          state.loadingPhoto = false;
        }
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        if (state.loadingPhoto) {
          state.loadingPhoto = false;
          state.errorPhoto = action.payload;
        }
      });
    builder
      .addCase(deletePhoto.pending, (state) => {
        if (!state.loadingPhoto) {
          state.loadingPhoto = true;
        }
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        if (state.loadingPhoto) {
          state.data = action.payload;
          state.loadingPhoto = false;
        }
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        if (state.loadingPhoto) {
          state.loadingPhoto = false;
          state.errorPhoto = action.payload;
        }
      });
  },
});

export const {} = photoSlice.actions;
export default photoSlice.reducer;
