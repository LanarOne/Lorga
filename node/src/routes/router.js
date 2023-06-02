import userRoutes from "./routes/UserRoutes.js";
import artisteRoutes from "./routes/ArtisteRoutes.js";

const initRoutes = (app) => {
  userRoutes(app);
  artisteRoutes(app);
};

export default initRoutes;
