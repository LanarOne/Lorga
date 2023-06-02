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
export const ArtisteDAO = { Create };
