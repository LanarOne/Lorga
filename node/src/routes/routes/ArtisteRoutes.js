import { Router } from "express";
import { ArtisteController } from "../../controllers/artisteController.js";

const ArtisteRoutes = (app) => {
  const router = Router();
  router.post("/create/:id", ArtisteController.createArtiste);

  app.use("/artiste", router);
};
export default ArtisteRoutes;
