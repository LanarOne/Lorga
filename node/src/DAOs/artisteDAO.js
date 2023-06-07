import Artiste from "../models/Artiste.js";

const Create = async (nom, description, influences, style, photoId, userId) => {
  let result = null;
  try {
    result = Artiste.create({
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
    const artistes = await Artiste.findAll();
    if (!artistes) {
      return null;
    }
    return artistes;
  } catch (error) {
    return Error(error.message);
  }
};

const ReadById = async (id) => {
  try {
    const artiste = await Artiste.findByPk(id);
    if (!artiste) {
      return null;
    }
    return artiste;
  } catch (error) {
    return Error(error.message);
  }
};

const UpdateOne = async (id, data) => {
  try {
    const artiste = await Artiste.findByPk(id);
    const { nom, description, influences, style, photoId } = data;
    if (!artiste) {
      return null;
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
export const ArtisteDAO = { Create, ReadAll, ReadById, UpdateOne, DeleteOne };
