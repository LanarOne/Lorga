import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, postFileRequest } from "../../api/api";
import { CREATE_PHOTO, GET_PHOTO_BY_ID } from "../../constants/constants";

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
      console.log(response);
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

export const photoSlice = createSlice({
  name: "photo",
  initialState: {
    alt: "",
    image: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postPhoto.pending, (state, action) => {
      if (!state.loading) {
        state.loading = true;
      }
    });
    builder.addCase(postPhoto.fulfilled, (state, action) => {
      if (state.loading) {
        state.loading = action.payload;
        state.loading = false;
      }
    });
    builder.addCase(postPhoto.rejected, (state, action) => {
      if (state.loading) {
        state.loading = false;
        state.error = action.payload;
      }
    });
  },
});

export const {} = photoSlice.actions;
export default photoSlice.reducer;
