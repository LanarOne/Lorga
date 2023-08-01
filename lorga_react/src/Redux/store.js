import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./Reducers/login.slice";
import { signupSlice } from "./Reducers/signup.slice";
import { artisteSlice } from "./Reducers/artistes.slice";
import { bookingSlice } from "./Reducers/bookings.slice";
import { createArtisteSlice } from "./Reducers/createArtiste.slice";
import { photoSlice } from "./Reducers/photo.slice";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    signup: signupSlice.reducer,
    artistes: artisteSlice.reducer,
    artiste: createArtisteSlice.reducer,
    bookings: bookingSlice.reducer,
    photo: photoSlice.reducer,
  },
});
