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
  let result = null;
  try {
    result = await Collectif.findAll();

    return result.map((collectif) => {
      const decodedData = {
        collectifId: collectif.id,
        nom: decodeURIComponent(collectif.nom),
        description: decodeURIComponent(collectif.description),
        influences: decodeURIComponent(collectif.influences),
        style: decodeURIComponent(collectif.style),
        photoId: collectif.photoId,
      };
      return decodedData;
    });
  } catch (error) {
    return Error(error.message);
  }
};

const ReadById = async (id) => {
  let result = null;
  try {
    result = await Collectif.findByPk(id);
    if (!result || result.length === 0) {
      return;
    }
    return {
      nom: decodeURIComponent(result.nom),
      description: decodeURIComponent(result.description),
      influences: decodeURIComponent(result.influences),
      style: decodeURIComponent(result.style),
      photoId: result.photoId,
    };
  } catch (error) {
    return Error(error.message);
  }
};

const UpdateOne = async (id, data) => {
  let result = null;
  try {
    let collectif = await Collectif.findByPk(id);
    const { nom, description, influences, style, photoId } = data;
    if (!collectif) {
      return;
    }
    result = await collectif.update({
      nom,
      description,
      influences,
      style,
      photoId,
    });
    return result;
  } catch (error) {
    return Error(error.message);
  }
};

const DeleteOne = async (id) => {
  let result = null;
  let message = `Le collectif a été retiré de la base de donnée`;
  try {
    result = await Collectif.findByPk(id);
    if (!result) {
      return;
    }
    await result.destroy();
    return message;
  } catch (error) {
    return Error(error.message);
  }
};
export const CollectifDAO = { Create, ReadAll, ReadById, UpdateOne, DeleteOne };
