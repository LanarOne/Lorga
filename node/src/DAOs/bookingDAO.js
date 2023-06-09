import Booking from "../models/Booking.js";

const Create = async (
  date,
  time,
  description,
  nbr_invite,
  collectifId,
  userId
) => {
  let result = null;
  try {
    result = Booking.create({
      date,
      time,
      description,
      nbr_invite,
      collectifId,
      userId,
    });
    return result;
  } catch (error) {
    return Error(error.message);
  }
};
const Confirm = async (id, confirmation) => {
  try {
    const booking = await Booking.findByPk(id);
    if (!booking || !confirmation) {
      return;
    }
    Booking.update(confirmation, { where: { id } });
    return booking;
  } catch (error) {
    return Error(error.message);
  }
};

const ReadAllBookings = async () => {
  try {
    const bookings = await Booking.findAll();
    return bookings;
  } catch (error) {
    return Error(error.message);
  }
};

const ReadBookingById = async (id) => {
  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return;
    }
    return booking;
  } catch (error) {
    return Error(error.message);
  }
};

const ReadBookingsByUserId = async (userId) => {
  try {
    const bookings = await Booking.findAll({ where: { userId } });
    if (!bookings) {
      return;
    }
    return bookings;
  } catch (error) {
    return Error(error.message);
  }
};

const ReadBookingsByCollectifId = async (collectifId) => {
  try {
    const bookings = await Booking.findAll({ where: { collectifId } });
    if (!bookings) {
      return;
    }
    return bookings;
  } catch (error) {
    return Error(error.message);
  }
};

const UpdateOneBooking = async (id, data) => {
  try {
    const booking = await Booking.findByPk(id);
    const { date, time, description, nbr_invite, collectifId } = data;
    if (!booking) {
      return;
    }
    const updatedBooking = Booking.update(
      { date, time, description, nbr_invite, collectifId },
      { where: { id } }
    );
    return updatedBooking;
  } catch (error) {
    return Error(error.message);
  }
};

const DeleteOneBooking = async (id) => {
  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return;
    }
    const destroyTarget = booking.destroy();
    return destroyTarget;
  } catch (error) {
    return Error(error.message);
  }
};
export const BookingDAO = {
  Create,
  Confirm,
  ReadAllBookings,
  ReadBookingById,
  ReadBookingsByUserId,
  ReadBookingsByCollectifId,
  UpdateOneBooking,
  DeleteOneBooking,
};
