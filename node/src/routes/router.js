import userRoutes from "./routes/UserRoutes.js";
import artisteRoutes from "./routes/ArtisteRoutes.js";
import collectifRoutes from "./routes/CollectifRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";
import photoRoutes from "./routes/PhotoRoutes.js";
import lienRoutes from "./routes/LienRoutes.js";
import BoissonRoutes from "./routes/BoissonRoutes.js";
import Admin_CollectifRoutes from "./routes/Admin_CollectifRoutes.js";

const initRoutes = (app) => {
  userRoutes(app);
  artisteRoutes(app);
  collectifRoutes(app);
  bookingRoutes(app);
  photoRoutes(app);
  lienRoutes(app);
  BoissonRoutes(app);
  Admin_CollectifRoutes(app);
};

export default initRoutes;
