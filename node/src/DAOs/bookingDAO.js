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

export const BookingDAO = { Create, Confirm };
