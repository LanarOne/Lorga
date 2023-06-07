import { Router } from "express";
import { CollectifController } from "../../controllers/collectifController.js";

const CollectifRoutes = (app) => {
  const router = Router();
  router.post("/create/:id", CollectifController.createCollectif);
  router.get("/readall", CollectifController.readAllCollectifs);
  router.get("/readone/:id", CollectifController.readOneCollectif);
  router.put("/updateone/:id", CollectifController.updateOneCollectif);
  router.delete("/deleteone/:id", CollectifController.deleteOneCollectif);

  app.use("/collectif", router);
};
export default CollectifRoutes;
