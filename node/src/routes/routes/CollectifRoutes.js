import { Router } from "express";
import { CollectifController } from "../../controllers/collectifController.js";

const CollectifRoutes = (app) => {
  const router = Router();
  router.post("/create/:id", CollectifController.createCollectif);

  app.use("/collectif", router);
};
export default CollectifRoutes;
