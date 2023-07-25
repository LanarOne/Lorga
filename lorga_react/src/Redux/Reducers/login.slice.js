import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    email: "",
    password: "",
  },
  reducers: {
    getEmail: (state, action) => {
      return { ...state, email: action.payload };
    },
    getPassword: (state, action) => {
      return { ...state, password: action.payload };
    },
  },
});

export const { getEmail, getPassword } = loginSlice.actions;
export default loginSlice.reducer;
