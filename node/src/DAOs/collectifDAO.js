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

export const CollectifDAO = { Create };
