import { Router } from "express";
import { BookingController } from "../../controllers/bookingController.js";

const bookingRoutes = (app, sm) => {
  const router = Router();
  router.post("/create/:id", sm, BookingController.createBooking);
  router.put("/confirmation/:id", sm, BookingController.confirmBooking);
  router.get("/readall", sm, BookingController.readAllBookings);
  router.get("/readonebyid/:id", sm, BookingController.readOneBookingById);
  router.get(
    "/readbookingsbyuserid/:id",
    sm,
    BookingController.readBookingsByUserId
  );
  router.get(
    "/readbookingsbycollectifid/:id",
    sm,
    BookingController.readBookingsByCollectifId
  );
  router.put("/updatebooking/:id", sm, BookingController.updateOneBooking);
  router.delete("/deletebooking/:id", sm, BookingController.deleteOneBooking);

  app.use("/booking", router);
};
export default bookingRoutes;
