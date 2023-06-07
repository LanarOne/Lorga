import Collectif from "../models/Collectif.js";

const Create = async (nom, description, influences, style, photoId, userId) => {
  let result = null;
  try {
    result = Collectif.create({
      nom,
      description,
      influences,
      style,
      photoId,
      userId,
    });
    return result;
  } catch (error) {
    return Error(error.message);
  }
};
const ReadAll = async () => {
  try {
    const collectifs = await Collectif.findAll();
    if (!collectifs) {
      return null;
    }
    return collectifs;
  } catch (error) {
    return Error(error.message);
  }
};

const ReadById = async (id) => {
  try {
    const collectif = await Collectif.findByPk(id);
    if (!collectif) {
      return;
    }
    return collectif;
  } catch (error) {
    return Error(error.message);
  }
};

const UpdateOne = async (id, data) => {
  try {
    const collectif = await Collectif.findByPk(id);
    const { nom, description, influences, style, photoId } = data;
    if (!collectif) {
      return;
    }
    await Collectif.update(
      { nom, description, influences, style, photoId },
      { where: { id } }
    );
    return collectif;
  } catch (error) {
    return Error(error.message);
  }
};

const DeleteOne = async (id) => {
  try {
    const collectif = await Collectif.findByPk(id);
    if (!collectif) {
      return;
    }
    await collectif.destroy();
    return `Le collectif a été retiré de la base de donnée`;
  } catch (error) {
    return Error(error.message);
  }
};
export const CollectifDAO = { Create, ReadAll, ReadById, UpdateOne, DeleteOne };
