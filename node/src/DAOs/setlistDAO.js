import Setlist from "../models/Setlist.js";

const Create = async (artisteId, bookingId) => {
  let result = null;
  try {
    result = await Setlist.create({ artisteId, bookingId });
    return result;
  } catch (e) {
    console.error(e.message);
    return new Error(e);
  }
};

const alreadyExist = async (artisteId, bookingId) => {
  let result = null;
  try {
    result = await Setlist.findAll({ where: { artisteId, bookingId } });
    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (e) {
    console.error(e.message);
    return new Error(e);
  }
};

const ReadById = async (id) => {
  let result;
  try {
    result = await Setlist.findByPk(id);
    return result;
  } catch (e) {
    console.error(e.message);
    throw new Error(e);
  }
};
const ReadByArtisteId = async (artisteId) => {
  let result;
  try {
    result = await Setlist.findAll({ where: { artisteId } });
    console.log(result, `DAO`);
    return result;
  } catch (e) {
    console.error(e.message);
    throw new Error(e);
  }
};
const ReadByBookingId = async (bookingId) => {
  let result;
  try {
    result = await Setlist.findAll({ where: { bookingId } });
    return result;
  } catch (e) {
    console.error(e.message);
    throw new Error(e);
  }
};

const DeleteOne = async (id) => {
  let result;
  try {
    result = await Setlist.destroy({ where: { id } });
    return result;
  } catch (e) {
    console.error(e.message);
    throw new Error(e);
  }
};
export const SetlistDAO = {
  Create,
  ReadByArtisteId,
  ReadByBookingId,
  ReadById,
  DeleteOne,
  alreadyExist,
};
