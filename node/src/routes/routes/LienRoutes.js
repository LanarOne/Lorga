import { Router } from "express";
import { LienController } from "../../controllers/lienController.js";

const LienRoutes = (app) => {
  const router = Router();
  router.post("/create", LienController.createLien);
  router.get("/readall", LienController.readAllLiens);
  router.get("/readone/:id", LienController.readOneById);
  router.get("/readbyartiste/:id", LienController.readByArtisteId);
  router.get("/readbycollectif/:id", LienController.readByCollectifId);
  router.put("/updateone/:id", LienController.updateOneLien);
  router.delete("/deleteone/:id", LienController.deleteOneLien);

  app.use("/lien", router);
};

export default LienRoutes;
