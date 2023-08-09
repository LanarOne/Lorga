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
      if (!state.loading) {
        state.loading = true;
      }
    });
    builder.addCase(postLogin.fulfilled, (state, action) => {
      if (state.loading) {
        state.loading = action.payload;
        state.loading = false;
      }
    });
    builder.addCase(postLogin.rejected, (state, action) => {
      if (state.loading) {
        state.loading = false;
        state.error = action.payload;
      }
    });
  },
});

export const { getEmail, getPassword } = loginSlice.actions;
export default loginSlice.reducer;
