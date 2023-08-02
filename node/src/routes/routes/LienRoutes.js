import { Router } from "express";
import { LienController } from "../../controllers/lienController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";
import { wrongRoute } from "../../utils/wrongPath.js";

const LienRoutes = (app, sm) => {
  const router = Router();
  router.post("/create", sm, jwtMiddleware, LienController.createLien);
  router.get("/readall", sm, jwtMiddleware, LienController.readAllLiens);
  router.get("/readone/:id", sm, jwtMiddleware, LienController.readOneById);
  router.get(
    "/readbyartiste/:id",
    sm,
    jwtMiddleware,
    LienController.readByArtisteId
  );
  router.get(
    "/readbycollectif/:id",
    sm,
    jwtMiddleware,
    LienController.readByCollectifId
  );
  router.put("/updateone/:id", sm, jwtMiddleware, LienController.updateOneLien);
  router.delete(
    "/deleteone/:id",
    sm,
    jwtMiddleware,
    LienController.deleteOneLien
  );
  router.post("/*", sm, wrongRoute.wrongPath);
  router.get("/*", sm, wrongRoute.wrongPath);
  router.delete("/*", sm, wrongRoute.wrongPath);
  router.put("/*", sm, wrongRoute.wrongPath);

  app.use("/lien", router);
};

export default LienRoutes;
