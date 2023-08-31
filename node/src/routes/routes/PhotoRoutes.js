import express, { Router } from "express";
import { PhotoController } from "../../controllers/photoController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";
import { upload } from "../../middlewares/multer.js";
import { wrongRoute } from "../../utils/wrongPath.js";
const PhotoRoutes = (app, sm) => {
  const router = Router();
  router.post(
    "/create",
    sm,
    jwtMiddleware,
    upload.single("image"),
    PhotoController.create
  );
  router.get("/readall", sm, jwtMiddleware, PhotoController.readAll);
  router.get("/readone/:id", sm, PhotoController.readById);
  router.put(
    "/updateone/:id",
    sm,
    jwtMiddleware,
    upload.single("image"),
    PhotoController.update
  );
  router.delete("/deleteone/:id", sm, jwtMiddleware, PhotoController.remove);
  router.use("/uploaded", express.static("uploads"));
  router.post("/*", sm, wrongRoute.wrongPath);
  router.get("/*", sm, wrongRoute.wrongPath);
  router.delete("/*", sm, wrongRoute.wrongPath);
  router.put("/*", sm, wrongRoute.wrongPath);

  app.use("/photo", router);
};
export default PhotoRoutes;
