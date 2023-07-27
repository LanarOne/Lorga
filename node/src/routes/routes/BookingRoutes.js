import { Router } from "express";
import { BookingController } from "../../controllers/bookingController.js";
import { jwtMiddleware } from "../../jwt/jwt.js";

const bookingRoutes = (app, sm) => {
  const router = Router();
  router.post(
    "/create/:id",
    sm,
    jwtMiddleware,
    BookingController.createBooking
  );
  router.put(
    "/confirmation/:id",
    sm,
    jwtMiddleware,
    BookingController.confirmBooking
  );
  router.get("/readall", sm, jwtMiddleware, BookingController.readAllBookings);
  router.get(
    "/readconfirmedcollectifsbookings",
    sm,
    BookingController.readConfirmedCollectifsBookings
  );
  router.get(
    "/readonebyid/:id",
    sm,
    jwtMiddleware,
    BookingController.readOneBookingById
  );
  router.get(
    "/readunconfirmed",
    sm,
    jwtMiddleware,
    BookingController.readUnconfirmed
  );
  router.get(
    "/readbookingsbyuserid/:id",
    sm,
    jwtMiddleware,
    BookingController.readBookingsByUserId
  );
  router.get(
    "/readbookingsbycollectifid/:id",
    sm,
    jwtMiddleware,
    BookingController.readBookingsByCollectifId
  );
  router.get(
    "/readbookingsbydate/",
    sm,
    jwtMiddleware,
    BookingController.readBookingByDate
  );
  router.get(
    "/readbookingsbydateclient",
    sm,
    jwtMiddleware,
    BookingController.readBookingByDateClient
  );
  router.put(
    "/updatebooking/:id",
    sm,
    jwtMiddleware,
    BookingController.updateOneBooking
  );
  router.delete(
    "/deletebooking/:id",
    sm,
    jwtMiddleware,
    BookingController.deleteOneBooking
  );

  app.use("/booking", router);
};
export default bookingRoutes;
