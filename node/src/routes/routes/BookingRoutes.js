import { Router } from "express";
import { BookingController } from "../../controllers/bookingController.js";

const bookingRoutes = (app) => {
  const router = Router();
  router.post("/create/:id", BookingController.createBooking);
  router.put("/confirmation/:id", BookingController.confirmBooking);

  app.use("/booking", router);
};
export default bookingRoutes;
