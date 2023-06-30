import { Router } from "express";
import { LienController } from "../../controllers/lienController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";

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

  app.use("/lien", router);
};

export default LienRoutes;
