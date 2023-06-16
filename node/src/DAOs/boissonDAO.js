import Boisson from "../models/Boisson.js";
import { Op } from "sequelize";

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

async function ReadAll() {
  let result = null;
  try {
    result = await Boisson.findAll();
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function ReadById(id) {
  let result = null;
  try {
    result = await Boisson.findByPk(id);
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function ReadByFamille(famille) {
  let result = null;
  try {
    result = await Boisson.findAll({ where: { famille } });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function ReadByType(type) {
  let result = null;
  try {
    result = await Boisson.findAll({ where: { type } });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function ReadBySaveurs(saveurs) {
  let result = null;
  try {
    const saveursArray = saveurs.split(/[, ]/).filter(Boolean);
    if (saveursArray.length > 1) {
      // Multiple words
      result = await Boisson.findAll({ where: { saveurs: saveursArray } });
    } else {
      // Single word
      result = await Boisson.findAll({
        where: { saveurs: { [Op.like]: `%${saveursArray[0]}%` } },
      });
    }
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function UpdateOne(id, data) {
  let result = null;
  try {
    result = await Boisson.findByPk(id);
    const { nom, famille, type, description, recette, saveurs, photoId } = data;
    await Boisson.update({
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

async function DeleteOne(id) {
  let result = null;
  let message = `La boisson a bien été supprimée de la base de données`;
  try {
    result = await Boisson.findByPk(id);
    await result.destroy();
    return message;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}
export const BoissonDAO = {
  Create,
  ReadAll,
  ReadById,
  ReadByFamille,
  ReadByType,
  ReadBySaveurs,
  UpdateOne,
  DeleteOne,
};
