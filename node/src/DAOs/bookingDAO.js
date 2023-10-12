import Booking from "../models/Booking.js";
import booking from "../models/Booking.js";
import { Op } from "sequelize";

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
    result = await Booking.update({ confirmation }, { where: { id } });
    return result;
  } catch (error) {
    return Error(error.message);
  }
};

const ReadAllBookings = async () => {
  let result = null;
  let confirmation = true;
  try {
    result = await Booking.findAll({ where: { confirmation } });
    return result.map((booking) => {
      return {
        id: booking.id,
        date: booking.date,
        time: booking.time,
        description: decodeURIComponent(booking.description),
        nbr_invite: booking.nbr_invite,
        confirmation: booking.confirmation,
        collectifId: booking.collectifId,
      };
    });
  } catch (error) {
    return Error(error.message);
  }
};

const ReadConfirmedCollectifBookings = async () => {
  let result = null;
  let confirmation = true;
  try {
    result = await Booking.findAll({
      where: { confirmation, collectifId: { [Op.not]: null } },
    });
    return result.map((booking) => {
      if (booking.collectifId) {
        return {
          id: booking.id,
          date: booking.date,
          time: booking.time,
          description: decodeURIComponent(booking.description),
          nbr_invite: booking.nbr_invite,
          confirmation: booking.confirmation,
          collectifId: booking.collectifId,
        };
      }
    });
  } catch (error) {
    return Error(error.message);
  }
};

const ReadUnconfirmedBookings = async () => {
  let result = null;
  let confirmation = false;
  try {
    result = await Booking.findAll({ where: { confirmation } });
    return result.map((booking) => {
      return {
        id: booking.id,
        date: booking.date,
        time: booking.time,
        description: decodeURIComponent(booking.description),
        nbr_invite: booking.nbr_invite,
        confirmation: booking.confirmation,
        collectifId: booking.collectifId,
      };
    });
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
};

const ReadBookingById = async (id) => {
  let result = null;
  try {
    result = await Booking.findByPk(id);
    if (!result || result.length === 0) {
      return;
    }
    return {
      date: result.date,
      time: result.time,
      description: decodeURIComponent(result.description),
      nbr_invite: result.nbr_invite,
      confirmation: result.confirmation,
      collectifId: result.collectifId,
    };
  } catch (error) {
    return Error(error.message);
  }
};

const ReadBookingsByUserId = async (userId) => {
  let result = null;
  let confirmation = true;
  try {
    result = await Booking.findAll({ where: { userId, confirmation } });
    return result.map((booking) => {
      return {
        date: booking.date,
        time: booking.time,
        description: decodeURIComponent(booking.description),
        nbr_invite: booking.nbr_invite,
        collectifId: booking.collectifId,
      };
    });
  } catch (error) {
    return Error(error.message);
  }
};

const ReadBookingsByCollectifId = async (collectifId) => {
  let result = null;
  let confirmation = true;
  try {
    result = await Booking.findAll({ where: { collectifId, confirmation } });
    return result.map((booking) => {
      return {
        id: booking.id,
        date: booking.date,
        time: booking.time,
        description: decodeURIComponent(booking.description),
        nbr_invite: booking.nbr_invite,
        collectifId: booking.collectifId,
      };
    });
  } catch (error) {
    return Error(error.message);
  }
};

const ReadBookingsByDate = async (date) => {
  let result = null;
  let confirmation = true;
  try {
    result = await booking.findAll({
      where: { date: date, confirmation },
    });
    return result.map((booking) => {
      return {
        date: booking.date,
        time: booking.time,
        description: decodeURIComponent(booking.description),
        nbr_invite: booking.nbr_invite,
        collectifId: booking.collectifId,
      };
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const ReadBookingsByDateClient = async (date) => {
  let result = null;
  let confirmation = true;
  let collectifId = null;
  try {
    result = await booking.findAll({
      where: { date: date, confirmation, collectifId },
    });
    return result.map((booking) => {
      return {
        date: booking.date,
        time: booking.time,
        description: decodeURIComponent(booking.description),
        nbr_invite: booking.nbr_invite,
        collectifId: booking.collectifId,
      };
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const UpdateOneBooking = async (id, data) => {
  let result = null;
  try {
    let booking = await Booking.findByPk(id);
    const { date, time, description, nbr_invite, confirmation, collectifId } =
      data;
    if (!booking) {
      return;
    }
    result = await Booking.update(
      { date, time, description, nbr_invite, confirmation, collectifId },
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
  ReadConfirmedCollectifBookings,
  ReadUnconfirmedBookings,
  ReadBookingById,
  ReadBookingsByUserId,
  ReadBookingsByCollectifId,
  ReadBookingsByDate,
  ReadBookingsByDateClient,
  UpdateOneBooking,
  DeleteOneBooking,
};
