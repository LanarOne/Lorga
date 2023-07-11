import { Router } from "express";
import { CollectifController } from "../../controllers/collectifController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";

const CollectifRoutes = (app, sm) => {
  const router = Router();
  router.post(
    "/create/:id",
    sm,
    jwtMiddleware,
    CollectifController.createCollectif
  );
  router.get("/readall", sm, CollectifController.readAllCollectifs);
  router.get("/readone/:id", sm, CollectifController.readOneCollectif);
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

  app.use("/collectif", router);
};
export default CollectifRoutes;
