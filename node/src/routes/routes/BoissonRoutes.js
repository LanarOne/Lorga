import { Router } from "express";
import { BoissonController } from "../../controllers/boissonController.js";

const BoissonRoutes = (app) => {
  const router = Router();
  router.post("/create", BoissonController.createBoisson);

  app.use("/boisson", router);
};

export default BoissonRoutes;
