import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest } from "../../api/api";
import { LOGIN } from "../../constants/constants";

export const postLogin = createAsyncThunk(
  "users/login",
  async ({ body }, { rejectWithValue }) => {
    let error;
    let status;
    try {
      const response = await postRequest(LOGIN, body);
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
export const loginSlice = createSlice({
  name: "login",
  initialState: {
    email: "",
    password: "",
    loadingLogin: false,
    errorLogin: null,
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
      if (!state.loadingLogin) {
        state.loadingLogin = true;
      }
    });
    builder.addCase(postLogin.fulfilled, (state, action) => {
      if (state.loadingLogin) {
        state.loadingLogin = action.payload;
        state.loadingLogin = false;
      }
    });
    builder.addCase(postLogin.rejected, (state, action) => {
      if (state.loadingLogin) {
        state.loadingLogin = false;
        state.errorLogin = action.payload;
      }
    });
  },
});

export const { getEmail, getPassword } = loginSlice.actions;
export default loginSlice.reducer;
