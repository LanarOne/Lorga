import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest } from "../../api/api";
import { LOGIN } from "../../constants/constants";

export const postLogin = createAsyncThunk("users/login", async ({ body }) => {
  try {
    const response = await postRequest(LOGIN, body);
    const status = response.status;
    if (status <= 201) {
      let { data, message, token } = response;
      return response;
    }
    if (status >= 400) {
      throw new Error(response.error.message);
    }
  } catch (e) {
    console.error(e.message);
    throw new Error(e.message);
  }
});
export const loginSlice = createSlice({
  name: "login",
  initialState: {
    email: "",
    password: "",
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
  },
  extraReducers: (builder) => {
    builder.addCase(postLogin.pending, (state, action) => {
      if (state.loading === false) {
        state.loading = true;
      }
    });
    builder.addCase(postLogin.fulfilled, (state, action) => {
      if (state.loading === true) {
        state.loading = action.payload;
        state.loading = false;
      }
    });
    builder.addCase(postLogin.rejected, (state, action) => {
      if (state.loading === true) {
        state.loading = false;
        state.error = action.payload;
      }
    });
  },
});

export const { getEmail, getPassword } = loginSlice.actions;
export default loginSlice.reducer;
