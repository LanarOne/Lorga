import { Router } from "express";
import { PhotoController } from "../../controllers/photoController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";
import { upload } from "../../middlewares/multer.js";
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
  router.get("/readone/:id", sm, jwtMiddleware, PhotoController.readById);
  router.put("/updateone/:id", sm, jwtMiddleware, PhotoController.update);
  router.delete("/deleteone/:id", sm, jwtMiddleware, PhotoController.remove);

  app.use("/photo", router);
};
export default PhotoRoutes;
