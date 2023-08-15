import { Router } from "express";
import { CollectifController } from "../../controllers/collectifController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";
import { wrongRoute } from "../../utils/wrongPath.js";

const CollectifRoutes = (app, sm) => {
  const router = Router();
  router.post(
    "/create/:id",
    sm,
    jwtMiddleware,
    CollectifController.createCollectif
  );
  router.put(
    "/confirmation/:id",
    sm,
    jwtMiddleware,
    CollectifController.confirmCollectif
  );
  router.get(
    "/readall",
    sm,
    jwtMiddleware,
    CollectifController.readAllCollectifs
  );
  router.get(
    "/readconfirmedcollectifs",
    sm,
    CollectifController.readConfirmedCollectifs
  );
  router.get(
    "/readunconfirmedcollectifs",
    sm,
    jwtMiddleware,
    CollectifController.readUnconfirmedCollectifs
  );
  router.get("/readone/:id", sm, CollectifController.readOneCollectif);
  router.get(
    "/readbynom/:nom",
    sm,
    jwtMiddleware,
    CollectifController.readByNom
  );
  router.get(
    "/readbycreateur/:createurId",
    sm,
    jwtMiddleware,
    CollectifController.readByCreateur
  );
  router.put(
    "/updateone/:id",
    sm,
    jwtMiddleware,
    CollectifController.updateOneCollectif
  );
  router.delete(
    "/deleteone/:id",
    sm,
    jwtMiddleware,
    CollectifController.deleteOneCollectif
  );
  router.post("/*", sm, wrongRoute.wrongPath);
  router.get("/*", sm, wrongRoute.wrongPath);
  router.delete("/*", sm, wrongRoute.wrongPath);
  router.put("/*", sm, wrongRoute.wrongPath);

  app.use("/collectif", router);
};
export default CollectifRoutes;
