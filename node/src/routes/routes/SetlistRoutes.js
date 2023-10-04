import { Router } from "express";
import { jwtMiddleware } from "../../jwt/jwt.js";
import { SetlistController } from "../../controllers/setlistController.js";

const SetlistRoutes = (app, sm) => {
  const router = Router();

  router
    .post("/create/:id", sm, jwtMiddleware, SetlistController.createSetlist)
    .get("/getbyid/:id", sm, jwtMiddleware, SetlistController.readSetlistById)
    .get("/getbybookingid/:id", sm, SetlistController.readSetlistByBookingId)
    .get(
      "/getbyartisteid/:id",
      sm,
      jwtMiddleware,
      SetlistController.readSetlistByArtisteId
    )
    .delete(
      "/deletesetlist/:id",
      sm,
      jwtMiddleware,
      SetlistController.deleteSetlist
    );

  app.use("/setlist", router);
};

export default SetlistRoutes;
