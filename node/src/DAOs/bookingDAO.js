import Booking from "../models/Booking.js";

const Create = async (
  date,
  time,
  description,
  nbr_invite,
  confirmation,
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
      confirmation,
      collectifId,
      userId,
    });
    return result;
  } catch (error) {
    return Error(error.message);
  }
};
const Confirm = async (id, confirmation) => {
  let result = null;
  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return result;
    }
    result = await Booking.update(confirmation, { where: { id } });
    return result;
  } catch (error) {
    return Error(error.message);
  }
};

const ReadAllBookings = async () => {
  let result = null;
  try {
    result = await Booking.findAll();
    return result.map((booking) => {
      const decodedData = {
        date: booking.date,
        time: booking.time,
        description: decodeURIComponent(booking.description),
        nbr_invite: booking.nbr_invite,
        collectifId: booking.collectifId,
      };
      return decodedData;
    });
  } catch (error) {
    return Error(error.message);
  }
};

const ReadBookingById = async (id) => {
  let result = null;
  try {
    result = await Booking.findByPk(id);
    return result;
  } catch (error) {
    return Error(error.message);
  }
};

const ReadBookingsByUserId = async (userId) => {
  let result = null;
  try {
    result = await Booking.findAll({ where: { userId } });
    return result;
  } catch (error) {
    return Error(error.message);
  }
};

const ReadBookingsByCollectifId = async (collectifId) => {
  let result = null;
  try {
    result = await Booking.findAll({ where: { collectifId } });
    return result;
  } catch (error) {
    return Error(error.message);
  }
};

const UpdateOneBooking = async (id, data) => {
  let result = null;
  try {
    let booking = await Booking.findByPk(id);
    const { date, time, description, nbr_invite, collectifId } = data;
    if (!booking) {
      return;
    }
    result = await Booking.update(
      { date, time, description, nbr_invite, collectifId },
      { where: { id } }
    );
    return result;
  } catch (error) {
    return Error(error.message);
  }
};

const DeleteOneBooking = async (id) => {
  let result = null;
  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return result;
    }
    result = await booking.destroy();
    return result;
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
