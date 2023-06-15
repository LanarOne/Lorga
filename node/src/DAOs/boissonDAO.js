import Boisson from "../models/Boisson.js";

async function Create(
  nom,
  famille,
  type,
  description,
  recette,
  saveurs,
  photoId
) {
  let result = null;
  try {
    result = await Boisson.create({
      nom,
      famille,
      type,
      description,
      recette,
      saveurs,
      photoId,
    });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

export const BoissonDAO = { Create };
