import { Router } from "express";
import { PhotoController } from "../../controllers/photoController.js";

const PhotoRoutes = (app) => {
  const router = Router();
  router.post("/create", PhotoController.create);
  router.get("/readall", PhotoController.readAll);
  router.get("/readone/:id", PhotoController.readById);
  router.put("/updateone/:id", PhotoController.update);
  router.delete("/deleteone/:id", PhotoController.remove);

  app.use("/photo", router);
};
export default PhotoRoutes;
