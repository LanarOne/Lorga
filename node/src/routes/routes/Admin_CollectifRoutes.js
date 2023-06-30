import { Router } from "express";
import { Admin_CollectifController } from "../../controllers/admin_collectifController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";

const Admin_CollectifRoutes = (app, sm) => {
  const router = Router();
  router.post(
    "/create/:id",
    sm,
    jwtMiddleware,
    Admin_CollectifController.createAdmin_collectif
  );
  router.get(
    "/readall",
    sm,
    jwtMiddleware,
    Admin_CollectifController.readAllAdmins
  );
  router.get(
    "/readbyuserid/:id",
    sm,
    jwtMiddleware,
    Admin_CollectifController.readAdminByUserId
  );
  router.get(
    "/readbycollectifid/:id",
    sm,
    jwtMiddleware,
    Admin_CollectifController.readByCollectifId
  );
  router.delete(
    "/deleteone/:id",
    sm,
    jwtMiddleware,
    Admin_CollectifController.deleteOne
  );

  app.use("/admin_collectif", router);
};
export default Admin_CollectifRoutes;
