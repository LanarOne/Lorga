import userRoutes from "./routes/UserRoutes.js";
import artisteRoutes from "./routes/ArtisteRoutes.js";
import collectifRoutes from "./routes/CollectifRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";

const initRoutes = (app) => {
  userRoutes(app);
  artisteRoutes(app);
  collectifRoutes(app);
  bookingRoutes(app);
};

export default initRoutes;
