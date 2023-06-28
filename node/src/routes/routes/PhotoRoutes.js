import { Router } from "express";
import { PhotoController } from "../../controllers/photoController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";
const PhotoRoutes = (app, sm, unSanitize) => {
  const router = Router();
  router.post("/create", sm, jwtMiddleware, PhotoController.create);
  router.get("/readall", sm, jwtMiddleware, PhotoController.readAll);
  router.get("/readone/:id", sm, jwtMiddleware, PhotoController.readById);
  router.put("/updateone/:id", sm, jwtMiddleware, PhotoController.update);
  router.delete("/deleteone/:id", sm, jwtMiddleware, PhotoController.remove);

  app.use("/photo", router);
};
export default PhotoRoutes;
