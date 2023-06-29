import { Router } from "express";
import { BoissonController } from "../../controllers/boissonController.js";

const BoissonRoutes = (app, sm) => {
  const router = Router();
  router.post("/create", sm, BoissonController.createBoisson);
  router.get("/readall", sm, BoissonController.readAllBoissons);
  router.get("/readonebyid/:id", sm, BoissonController.readOneBoissonById);
  router.get(
    "/readbyfamille/:famille",
    sm,
    BoissonController.readBoissonsByFamille
  );
  router.get("/readbytype/:type", sm, BoissonController.readBoissonsByType);
  router.get(
    "/readbysaveurs/:saveurs",
    sm,
    BoissonController.readBoissonsBySaveurs
  );
  router.put("/update/:id", sm, BoissonController.updateOneBoisson);
  router.delete("/deleteone/:id", sm, BoissonController.deleteOneBoisson);

  app.use("/boisson", router);
};

export default BoissonRoutes;
