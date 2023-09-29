import { sanitizeMiddleware } from "../middlewares/sanitize.js";
import Admin_CollectifRoutes from "./routes/Admin_CollectifRoutes.js";
import artisteRoutes from "./routes/ArtisteRoutes.js";
import Artiste_CollectifRoutes from "./routes/Artiste_CollectifRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";
import BoissonRoutes from "./routes/BoissonRoutes.js";
import collectifRoutes from "./routes/CollectifRoutes.js";
import lienRoutes from "./routes/LienRoutes.js";
import photoRoutes from "./routes/PhotoRoutes.js";
import SetlistRoutes from "./routes/SetlistRoutes.js";
import userRoutes from "./routes/UserRoutes.js";

const initRoutes = (app) => {
  Admin_CollectifRoutes(app, sanitizeMiddleware);
  artisteRoutes(app, sanitizeMiddleware);
  Artiste_CollectifRoutes(app, sanitizeMiddleware);
  BoissonRoutes(app, sanitizeMiddleware);
  bookingRoutes(app, sanitizeMiddleware);
  collectifRoutes(app, sanitizeMiddleware);
  lienRoutes(app, sanitizeMiddleware);
  photoRoutes(app, sanitizeMiddleware);
  SetlistRoutes(app, sanitizeMiddleware);
  userRoutes(app, sanitizeMiddleware);
};

export default initRoutes;
