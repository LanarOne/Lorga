import { Router } from "express";
import { Admin_CollectifController } from "../../controllers/admin_collectifController.js";

const Admin_CollectifRoutes = (app) => {
  const router = Router();
  router.post("/create/:id", Admin_CollectifController.createAdmin_collectif);
  router.get("/readall", Admin_CollectifController.readAllAdmins);
  router.get("/readbyuserid/:id", Admin_CollectifController.readAdminByUserId);
  router.get(
    "/readbycollectifid/:id",
    Admin_CollectifController.readByCollectifId
  );

  app.use("/admin_collectif", router);
};
export default Admin_CollectifRoutes;
