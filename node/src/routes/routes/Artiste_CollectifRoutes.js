import { Router } from "express";
import { Artiste_CollectifController } from "../../controllers/artiste_collectifController.js";

const Artiste_CollectifRoutes = (app) => {
  const router = Router();
  router.post(
    "/create/:id",
    Artiste_CollectifController.createArtiste_Collectif
  );
  router.get("/readall", Artiste_CollectifController.readAll);
  router.get("/readbyartiste/:id", Artiste_CollectifController.readByArtisteId);
  router.get(
    "/readbycollectif/:id",
    Artiste_CollectifController.readByCollectifId
  );
  router.delete("/deleteone/:id", Artiste_CollectifController.deleteOne);

  app.use("/artiste_collectif", router);
};

export default Artiste_CollectifRoutes;
