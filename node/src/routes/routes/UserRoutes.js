import { Router } from "express";
import { UserController } from "../../controllers/userController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";
import { wrongRoute } from "../../utils/wrongPath.js";

const userRoutes = (app, sm) => {
  const router = Router();
  router.post("/signup", sm, UserController.signUp);
  router.post("/signin", sm, UserController.signIn);
  router.get("/getall", sm, jwtMiddleware, UserController.readAll);
  router.get("/getone/:id", sm, jwtMiddleware, UserController.readOne);
  router.get("/getone", sm, jwtMiddleware, UserController.getUser);
  router.put("/update/:id", sm, jwtMiddleware, UserController.updateOne);
  router.put(
    "/updateroleid/:id",
    sm,
    jwtMiddleware,
    UserController.updateRoleId
  );
  router.delete("/delete/:id", sm, jwtMiddleware, UserController.deleteOne);
  router.post("/*", sm, wrongRoute.wrongPath);
  router.get("/*", sm, wrongRoute.wrongPath);
  router.delete("/*", sm, wrongRoute.wrongPath);
  router.put("/*", sm, wrongRoute.wrongPath);

  app.use("/users", router);
};

export default userRoutes;
