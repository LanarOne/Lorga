import { Router } from "express";
import { LienController } from "../../controllers/lienController.js";

const LienRoutes = (app, sm) => {
  const router = Router();
  router.post("/create", sm, LienController.createLien);
  router.get("/readall", sm, LienController.readAllLiens);
  router.get("/readone/:id", sm, LienController.readOneById);
  router.get("/readbyartiste/:id", sm, LienController.readByArtisteId);
  router.get("/readbycollectif/:id", sm, LienController.readByCollectifId);
  router.put("/updateone/:id", sm, LienController.updateOneLien);
  router.delete("/deleteone/:id", sm, LienController.deleteOneLien);

  app.use("/lien", router);
};

export default LienRoutes;
