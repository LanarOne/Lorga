import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./Reducers/login.slice";
import { signupSlice } from "./Reducers/signup.slice";
import { artisteSlice } from "./Reducers/artistes.slice";
import { bookingSlice } from "./Reducers/bookings.slice";
import { createArtisteSlice } from "./Reducers/createArtiste.slice";
import { photoSlice } from "./Reducers/photo.slice";
import { uploadsSlice } from "./Reducers/uploads.slice";
import { createCollectifSlice } from "./Reducers/createCollectif.slice";
import { collectifsSlice } from "./Reducers/collectifs.slice";
import { userSlice } from "./Reducers/user.slice";
import { boissonSlice } from "./Reducers/boisson.slice";
import { boissonsSlice } from "./Reducers/boissons.slice";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    signup: signupSlice.reducer,
    artistes: artisteSlice.reducer,
    artiste: createArtisteSlice.reducer,
    bookings: bookingSlice.reducer,
    photo: photoSlice.reducer,
    upload: uploadsSlice.reducer,
    collectif: createCollectifSlice.reducer,
    collectifs: collectifsSlice.reducer,
    user: userSlice.reducer,
    boisson: boissonSlice.reducer,
    boissons: boissonsSlice.reducer,
  },
});
