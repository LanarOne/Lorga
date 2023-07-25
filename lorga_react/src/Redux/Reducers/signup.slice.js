import { createSlice } from "@reduxjs/toolkit";

export const signupSlice = createSlice({
  name: "signup",
  initialState: {
    email: "",
    password: "",
    confirmation: false,
    username: "",
    zipCode: "",
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
});

export const {
  getEmail,
  getPassword,
  getConfirmation,
  getUsername,
  getZipCode,
} = signupSlice.actions;
export default signupSlice.reducer;
