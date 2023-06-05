import userRoutes from "./routes/UserRoutes.js";
import artisteRoutes from "./routes/ArtisteRoutes.js";
import collectifRoutes from "./routes/CollectifRoutes.js";

const initRoutes = (app) => {
  userRoutes(app);
  artisteRoutes(app);
  collectifRoutes(app);
};

export default initRoutes;
