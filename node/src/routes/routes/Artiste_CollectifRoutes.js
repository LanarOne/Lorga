import { Router } from "express";
import { Artiste_CollectifController } from "../../controllers/artiste_collectifController.js";

const Artiste_CollectifRoutes = (app) => {
  const router = Router();
  router.post(
    "/create/:id",
    Artiste_CollectifController.createArtiste_Collectif
  );

  app.use("/artiste_collectif", router);
};

export default Artiste_CollectifRoutes;
