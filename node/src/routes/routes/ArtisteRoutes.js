import { Router } from "express";
import { ArtisteController } from "../../controllers/artisteController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";

const ArtisteRoutes = (app, sm) => {
  const router = Router();
  router.post(
    "/create/:id",
    sm,
    jwtMiddleware,
    ArtisteController.createArtiste
  );
  router.get("/readall", sm, ArtisteController.readAllArtistes);
  router.get(
    "/readone/:id",
    sm,
    jwtMiddleware,
    ArtisteController.readOneArtiste
  );
  router.get(
    "/readbyuserid/:id",
    sm,
    jwtMiddleware,
    ArtisteController.readByUserId
  );
  router.put(
    "/updateone/:id",
    sm,
    jwtMiddleware,
    ArtisteController.updateOneArtiste
  );
  router.delete(
    "/deleteone/:id",
    sm,
    jwtMiddleware,
    ArtisteController.deleteOneArtiste
  );

  app.use("/artiste", router);
};
export default ArtisteRoutes;
