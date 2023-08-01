import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postFileRequest } from "../../api/api";
import { CREATE_PHOTO } from "../../constants/constants";

export const postPhoto = createAsyncThunk(
  "photo/create",
  async ({ image, token }, { rejectWithValue }) => {
    let error;
    let status;
    try {
      console.log(image, token);
      const formData = new FormData();
      let alt = `ntm`;
      formData.append("image", image);
      formData.append("alt", alt);
      const response = await postFileRequest(CREATE_PHOTO, formData, token);
      console.log(response);
      status = response.status;
      error = response.error;
      if (status >= 400 || !status || error) {
        throw rejectWithValue(error, status);
      }
      if (status <= 201) {
        return response;
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
  reducers: {
    getAlt: (state, action) => {
      return { ...state, alt: action.payload };
    },
  },
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

export const { getAlt } = photoSlice.actions;
export default photoSlice.reducer;
