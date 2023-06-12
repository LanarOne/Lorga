import Lien from "../models/Lien.js";

const Create = async (url, artisteId, collectifId) => {
  let result = null;
  try {
    result = await Lien.create({ url, artisteId, collectifId });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const ReadAll = async () => {
  let result = null;
  try {
    result = await Lien.findAll();
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const ReadById = async (id) => {
  let result = null;
  try {
    result = await Lien.findByPk(id);
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const UpdateOne = async (id, data) => {
  let result = null;
  try {
    result = Lien.findByPk(id);
    const { url, artisteId, collectifId } = data;
    await Lien.update({ url, artisteId, collectifId }, { where: { id } });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const DeleteOne = async (id) => {
  let result = null;
  try {
    result = await Lien.findByPk(id);
    if (!result) {
      return null;
    }
    await result.destroy();
    return `Le lien a été effacé de la base de données avec succès`;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

export const LienDAO = { Create, ReadAll, ReadById, UpdateOne, DeleteOne };
