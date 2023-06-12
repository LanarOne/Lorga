import userRoutes from "./routes/UserRoutes.js";
import artisteRoutes from "./routes/ArtisteRoutes.js";
import collectifRoutes from "./routes/CollectifRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";
import photoRoutes from "./routes/PhotoRoutes.js";
import lienRoutes from "./routes/LienRoutes.js";

const initRoutes = (app) => {
  userRoutes(app);
  artisteRoutes(app);
  collectifRoutes(app);
  bookingRoutes(app);
  photoRoutes(app);
  lienRoutes(app);
};

export default initRoutes;
