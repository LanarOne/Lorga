import { stringIsFilled } from "../utils/stringUtils.js";
import Boisson from "../models/Boisson.js";
import { BoissonDAO } from "../DAOs/boissonDAO.js";

async function createBoisson(req, res) {
  let result = null;
  try {
    const { nom, famille, type, description, recette, saveurs, photoId } =
      req.body;
    if (
      !stringIsFilled(nom) ||
      !stringIsFilled(famille) ||
      !stringIsFilled(type) ||
      !stringIsFilled(description) ||
      !stringIsFilled(recette) ||
      !stringIsFilled(saveurs) ||
      !photoId
    ) {
      return res
        .status(400)
        .json({ message: `Tous les champs sont obligatoires` });
    }
    const existingBoisson = await Boisson.findOne({ where: { nom } });
    if (existingBoisson) {
      return res
        .status(409)
        .json({ message: `Boisson déjà présente en base de données` });
    }
    result = await BoissonDAO.Create(
      nom,
      famille,
      type,
      description,
      recette,
      saveurs,
      photoId
    );
    return res
      .status(201)
      .json({ message: `Boisson créée avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

export const BoissonController = { createBoisson };
