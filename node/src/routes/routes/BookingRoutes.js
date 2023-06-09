import { Router } from "express";
import { BookingController } from "../../controllers/bookingController.js";

const bookingRoutes = (app) => {
  const router = Router();
  router.post("/create/:id", BookingController.createBooking);
  router.put("/confirmation/:id", BookingController.confirmBooking);
  router.get("/readall", BookingController.readAllBookings);
  router.get("/readonebyid/:id", BookingController.readOneBookingById);
  router.get(
    "/readbookingsbyuserid/:id",
    BookingController.readBookingsByUserId
  );
  router.get(
    "/readbookingsbycollectifid/:id",
    BookingController.readBookingsByCollectifId
  );
  router.put("/updatebooking/:id", BookingController.updateOneBooking);
  router.delete("/deletebooking/:id", BookingController.deleteOneBooking);

  app.use("/booking", router);
};
export default bookingRoutes;
