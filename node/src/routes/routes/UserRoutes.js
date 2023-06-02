import { Router } from "express";
import { UserController } from "../../controllers/userController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";

const userRoutes = (app) => {
  const router = Router();
  router.post("/signup", UserController.signUp);
  router.post("/signin", UserController.signIn);
  router.get("/getall", jwtMiddleware, UserController.readAll);
  router.get("/getone/:id", jwtMiddleware, UserController.readOne);
  router.put("/update/:id", jwtMiddleware, UserController.updateOne);
  router.delete("/delete/:id", jwtMiddleware, UserController.deleteOne);

  app.use("/users", router);
};

export default userRoutes;
