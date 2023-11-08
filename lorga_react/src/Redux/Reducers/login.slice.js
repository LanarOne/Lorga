import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, postRequest, putRequest } from "../../api/api";
import { GET_USER_BY_ID, LOGIN, UPDATE_USER } from "../../constants/constants";

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

export const updatePassword = createAsyncThunk(
  "user/updatepassword",
  async ({ body, token }, thunkAPI) => {
    let status;
    let error;
    const { oldPassword, newPassword, id } = body;
    let url = `${GET_USER_BY_ID}${id}`;
    const response = await getRequest(url, token);
    status = response.status;
    error = response.error;
    if (status === 200) {
      const { email } = response.result.data;
      const password = oldPassword;
      let body = { email, password };
      const login = await postRequest(LOGIN, body);
      const { token } = login.result;
      if (token) {
        const password = newPassword;
        url = `${UPDATE_USER}${id}`;
        const body = { password };
        const updatePw = await putRequest(url, body, token);
        status = updatePw.status;
        error = updatePw.error;
        if (status === 200) {
          const result = updatePw.result;
          return thunkAPI.fulfillWithValue({ result, status });
        }
        if (status >= 400 || error) {
          let { message } = error;
          return thunkAPI.rejectWithValue({ message, status });
        }
      }
    }
    if (status >= 400 || error) {
      let { message } = error;
      return thunkAPI.rejectWithValue({ message, status });
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
