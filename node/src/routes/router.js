import userRoutes from "./routes/UserRoutes.js";
import artisteRoutes from "./routes/ArtisteRoutes.js";
import collectifRoutes from "./routes/CollectifRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";
import photoRoutes from "./routes/PhotoRoutes.js";
import lienRoutes from "./routes/LienRoutes.js";
import BoissonRoutes from "./routes/BoissonRoutes.js";
import Admin_CollectifRoutes from "./routes/Admin_CollectifRoutes.js";
import Artiste_CollectifRoutes from "./routes/Artiste_CollectifRoutes.js";
import { sanitizeMiddleware } from "../middlewares/sanitize.js";

const initRoutes = (app) => {
  userRoutes(app, sanitizeMiddleware);
  artisteRoutes(app, sanitizeMiddleware);
  collectifRoutes(app, sanitizeMiddleware);
  bookingRoutes(app, sanitizeMiddleware);
  photoRoutes(app, sanitizeMiddleware);
  lienRoutes(app, sanitizeMiddleware);
  BoissonRoutes(app, sanitizeMiddleware);
  Admin_CollectifRoutes(app, sanitizeMiddleware);
  Artiste_CollectifRoutes(app, sanitizeMiddleware);
};

export default initRoutes;
