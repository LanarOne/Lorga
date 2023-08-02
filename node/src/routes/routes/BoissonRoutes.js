import { Router } from "express";
import { BoissonController } from "../../controllers/boissonController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";
import { wrongRoute } from "../../utils/wrongPath.js";

const BoissonRoutes = (app, sm) => {
  const router = Router();
  router.post("/create", sm, jwtMiddleware, BoissonController.createBoisson);
  router.get("/readall", sm, jwtMiddleware, BoissonController.readAllBoissons);
  router.get(
    "/readonebyid/:id",
    sm,
    jwtMiddleware,
    BoissonController.readOneBoissonById
  );
  router.get(
    "/readbyfamille/:famille",
    sm,
    jwtMiddleware,
    BoissonController.readBoissonsByFamille
  );
  router.get(
    "/readbytype/:type",
    sm,
    jwtMiddleware,
    BoissonController.readBoissonsByType
  );
  router.get(
    "/readbysaveurs/:saveurs",
    sm,
    jwtMiddleware,
    BoissonController.readBoissonsBySaveurs
  );
  router.put(
    "/update/:id",
    sm,
    jwtMiddleware,
    BoissonController.updateOneBoisson
  );
  router.delete(
    "/deleteone/:id",
    sm,
    jwtMiddleware,
    BoissonController.deleteOneBoisson
  );
  router.post("/*", sm, wrongRoute.wrongPath);
  router.get("/*", sm, wrongRoute.wrongPath);
  router.delete("/*", sm, wrongRoute.wrongPath);
  router.put("/*", sm, wrongRoute.wrongPath);

  app.use("/boisson", router);
};

export default BoissonRoutes;
