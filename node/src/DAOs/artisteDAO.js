import Artiste from "../models/Artiste.js";

const Create = async (nom, description, influences, style, photoId, userId) => {
  let result = null;
  try {
    result = await Artiste.create({
      nom,
      description,
      influences,
      style,
      photoId,
      userId,
    });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const ReadAll = async () => {
  let result = null;
  try {
    result = await Artiste.findAll();
    return result.map((artiste) => {
      const decodedData = {
        nom: decodeURIComponent(artiste.nom),
        description: decodeURIComponent(artiste.description),
        influences: decodeURIComponent(artiste.influences),
        style: decodeURIComponent(artiste.style),
        photoId: artiste.photoId,
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
    result = await Artiste.findByPk(id);
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

const ReadByUserId = async (userId) => {
  let result = null;
  try {
    result = await Artiste.findOne({ where: { userId } });
    return {
      nom: decodeURIComponent(result.nom),
      description: decodeURIComponent(result.description),
      influences: decodeURIComponent(result.influences),
      style: decodeURIComponent(result.style),
      photoId: result.photoId,
    };
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const UpdateOne = async (id, data) => {
  try {
    const artiste = await Artiste.findByPk(id);
    const { nom, description, influences, style, photoId } = data;
    if (!artiste) {
      return;
    }
    await Artiste.update(
      { nom, description, influences, style, photoId },
      { where: { id } }
    );
    return artiste;
  } catch (error) {
    return Error(error.message);
  }
};
const DeleteOne = async (id) => {
  try {
    const artiste = await Artiste.findByPk(id);
    if (!artiste) {
      return;
    }
    await artiste.destroy();
    return `L'artiste a été retiré de la base de données`;
  } catch (error) {
    return Error(error.message);
  }
};
export const ArtisteDAO = {
  Create,
  ReadAll,
  ReadById,
  ReadByUserId,
  UpdateOne,
  DeleteOne,
};
