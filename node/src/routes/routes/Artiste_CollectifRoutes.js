import { Router } from "express";
import { Artiste_CollectifController } from "../../controllers/artiste_collectifController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";

const Artiste_CollectifRoutes = (app, sm) => {
  const router = Router();
  router.post(
    "/create/:id",
    sm,
    jwtMiddleware,
    Artiste_CollectifController.createArtiste_Collectif
  );
  router.put(
    "/confirmation/:id",
    sm,
    jwtMiddleware,
    Artiste_CollectifController.confirmArtCol
  );
  router.get(
    "/readall",
    sm,
    jwtMiddleware,
    Artiste_CollectifController.readAll
  );
  router.get(
    "/readunconfirmed",
    sm,
    jwtMiddleware,
    Artiste_CollectifController.readUnconfirmed
  );
  router.get(
    "/readbyartiste/:id",
    sm,
    jwtMiddleware,
    Artiste_CollectifController.readByArtisteId
  );
  router.get(
    "/readbycollectif/:id",
    sm,
    jwtMiddleware,
    Artiste_CollectifController.readByCollectifId
  );
  router.delete(
    "/deleteone/:id",
    sm,
    jwtMiddleware,
    Artiste_CollectifController.deleteOne
  );

  app.use("/artiste_collectif", router);
};

export default Artiste_CollectifRoutes;
