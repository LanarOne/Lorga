import { Router } from "express";
import { BoissonController } from "../../controllers/boissonController.js";

const BoissonRoutes = (app) => {
  const router = Router();
  router.post("/create", BoissonController.createBoisson);
  router.get("/readall", BoissonController.readAllBoissons);
  router.get("/readonebyid/:id", BoissonController.readOneBoissonById);
  router.get(
    "/readbyfamille/:famille",
    BoissonController.readBoissonsByFamille
  );
  router.get("/readbytype/:type", BoissonController.readBoissonsByType);
  router.get(
    "/readbysaveurs/:saveurs",
    BoissonController.readBoissonsBySaveurs
  );

  app.use("/boisson", router);
};

export default BoissonRoutes;
