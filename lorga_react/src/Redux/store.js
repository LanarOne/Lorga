import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./Reducers/login.slice";
import { signupSlice } from "./Reducers/signup.slice";
import { artisteSlice } from "./Reducers/artistes.slice";
import { bookingSlice } from "./Reducers/bookings.slice";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    signup: signupSlice.reducer,
    artistes: artisteSlice.reducer,
    bookings: bookingSlice.reducer,
  },
});
