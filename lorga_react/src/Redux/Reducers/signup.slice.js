import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest } from "../../api/api";
import { SIGNUP } from "../../constants/constants";

export const postSignup = createAsyncThunk("users/signup", async ({ body }) => {
  try {
    const response = await postRequest(SIGNUP, body);
    const status = response.status;
    if (status <= 201) {
      return response;
    }
    if (status >= 400) {
      throw new Error(response.error.message);
    }
  } catch (e) {
    console.error(e.meta);
    throw new Error(e.message);
  }
});
export const signupSlice = createSlice({
  name: "signup",
  initialState: {
    email: "",
    password: "",
    confirmation: "",
    username: "",
    zipCode: "",
    loading: false,
    error: null,
  },
  reducers: {
    getEmail: (state, action) => {
      return { ...state, email: action.payload };
    },
    getPassword: (state, action) => {
      return { ...state, password: action.payload };
    },
    getConfirmation: (state, action) => {
      return { ...state, confirmation: action.payload };
    },
    getUsername: (state, action) => {
      return { ...state, username: action.payload };
    },
    getZipCode: (state, action) => {
      return { ...state, zipCode: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postSignup.pending, (state, action) => {
      if (state.loading === false) {
        state.loading = true;
      }
    });
    builder.addCase(postSignup.fulfilled, (state, action) => {
      if (state.loading === true) {
        state.loading = action.payload;
        state.loading = false;
      }
    });
    builder.addCase(postSignup.rejected, (state, action) => {
      if (state.loading) {
        state.loading = false;
        state.error = action.payload;
      }
    });
  },
});

export const {
  getEmail,
  getPassword,
  getConfirmation,
  getUsername,
  getZipCode,
} = signupSlice.actions;
export default signupSlice.reducer;
