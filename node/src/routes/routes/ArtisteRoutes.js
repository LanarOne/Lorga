import { Router } from "express";
import { ArtisteController } from "../../controllers/artisteController.js";

const ArtisteRoutes = (app) => {
  const router = Router();
  router.post("/create/:id", ArtisteController.createArtiste);
  router.get("/readall", ArtisteController.readAllArtistes);
  router.get("/readone/:id", ArtisteController.readOneArtiste);
  router.put("/updateone/:id", ArtisteController.updateOneArtiste);
  router.delete("/deleteone/:id", ArtisteController.deleteOneArtiste);

  app.use("/artiste", router);
};
export default ArtisteRoutes;
