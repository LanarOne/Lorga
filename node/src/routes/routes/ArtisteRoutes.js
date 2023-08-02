import { Router } from "express";
import { ArtisteController } from "../../controllers/artisteController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";
import { wrongRoute } from "../../utils/wrongPath.js";
const ArtisteRoutes = (app, sm) => {
  const router = Router();
  router.post(
    "/create/:id",
    sm,
    jwtMiddleware,
    ArtisteController.createArtiste
  );
  router.put(
    "/confirmation/:id",
    sm,
    jwtMiddleware,
    ArtisteController.confirmArtiste
  );
  router.get("/readall", sm, ArtisteController.readAllArtistes);
  router.get(
    "/readone/:id",
    sm,
    jwtMiddleware,
    ArtisteController.readOneArtiste
  );
  router.get(
    "/readconfirmedartistes",
    sm,
    ArtisteController.readConfirmedArtistes
  );
  router.get(
    "/readunconfirmedartistes",
    sm,
    jwtMiddleware,
    ArtisteController.readUnconfirmedArtistes
  );
  router.get(
    "/readbyuserid/:id",
    sm,
    jwtMiddleware,
    ArtisteController.readByUserId
  );
  router.get("/readbynom/:nom", sm, jwtMiddleware, ArtisteController.readByNom);
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
  router.post("/*", sm, wrongRoute.wrongPath);
  router.get("/*", sm, wrongRoute.wrongPath);
  router.delete("/*", sm, wrongRoute.wrongPath);
  router.put("/*", sm, wrongRoute.wrongPath);

  app.use("/artiste", router);
};
export default ArtisteRoutes;
