import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./reducers/login.slice";
import { signupSlice } from "./reducers/signup.slice";
import { artisteSlice } from "./reducers/artistes.slice";
import { bookingSlice } from "./reducers/bookings.slice";
import { createArtisteSlice } from "./reducers/createArtiste.slice";
import { photoSlice } from "./reducers/photo.slice";
import { uploadsSlice } from "./reducers/uploads.slice";
import { createCollectifSlice } from "./reducers/createCollectif.slice";
import { collectifsSlice } from "./reducers/collectifs.slice";
import { userSlice } from "./reducers/user.slice";
import { boissonSlice } from "./reducers/boisson.slice";
import { boissonsSlice } from "./reducers/boissons.slice";
import { BookingSlice } from "./reducers/booking.slice";
import { SetlistSlice } from "./reducers/setlist.slice";
import { setlistsSlice } from "./reducers/setlists.slice";
import { lienSlice } from "./reducers/lien.slice";
import { liensSlice } from "./reducers/liens.slice";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    signup: signupSlice.reducer,
    artistes: artisteSlice.reducer,
    artiste: createArtisteSlice.reducer,
    bookings: bookingSlice.reducer,
    booking: BookingSlice.reducer,
    photo: photoSlice.reducer,
    upload: uploadsSlice.reducer,
    collectif: createCollectifSlice.reducer,
    collectifs: collectifsSlice.reducer,
    user: userSlice.reducer,
    boisson: boissonSlice.reducer,
    boissons: boissonsSlice.reducer,
    setlist: SetlistSlice.reducer,
    setlists: setlistsSlice.reducer,
    lien: lienSlice.reducer,
    liens: liensSlice.reducer,
  },
});
