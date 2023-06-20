import { stringIsFilled } from "../utils/stringUtils.js";
import Boisson from "../models/Boisson.js";
import { BoissonDAO } from "../DAOs/boissonDAO.js";
import { isAdmin } from "../utils/adminUtils.js";

let result = null;
async function createBoisson(req, res) {
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

async function readAllBoissons(req, res) {
  result = await BoissonDAO.ReadAll();
  if (!result) {
    return res
      .status(404)
      .json({ message: `Liste des boissons introuvables ou inexistante` });
  }
  return res.status(200).json({
    message: `Liste des boissons récupérée avec succès`,
    data: result,
  });
}

async function readOneBoissonById(req, res) {
  const id = req.params.id;
  result = await BoissonDAO.ReadById(id);
  if (!result) {
    return res
      .status(404)
      .json({ message: `Boisson introuvable ou inexistante` });
  }
  return res
    .status(200)
    .json({ message: `Boisson récupérée avec succès`, data: result });
}

async function readBoissonsByFamille(req, res) {
  const famille = req.params.famille;
  result = await BoissonDAO.ReadByFamille(famille);
  if (!result || result.length === 0) {
    return res
      .status(404)
      .json({ message: `Famille introuvable ou inexistante` });
  }
  return res.status(200).json({
    message: `Liste de boisson triées par famille récupérée avec succès`,
    data: result,
  });
}

async function readBoissonsByType(req, res) {
  const type = req.params.type;
  result = await BoissonDAO.ReadByType(type);
  if (!result || result.length === 0) {
    return res
      .status(404)
      .json({ message: `Type de boisson introuvable ou inexistante` });
  }
  return res.status(200).json({
    message: `Liste de boisson triées par type récupérée avec succès`,
    data: result,
  });
}

async function readBoissonsBySaveurs(req, res) {
  const saveurs = req.params.saveurs;
  result = await BoissonDAO.ReadBySaveurs(saveurs);
  if (!result || result.length === 0) {
    return res
      .status(404)
      .json({ message: `Type de saveur introuvable ou inexistante` });
  }
  return res.status(200).json({
    message: `Liste de boisson triées par saveurs récupérée avec succès`,
    data: result,
  });
}

async function updateOneBoisson(req, res) {
  const id = req.params.id;
  const existingBoisson = await BoissonDAO.ReadById(id);
  if (!existingBoisson) {
    return res
      .status(404)
      .json({ message: `Boisson introuvable ou inexistante` });
  }
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
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
      .status(406)
      .json({ message: `Tous les champs doivent être remplis correctement` });
  }
  const data = { nom, famille, type, description, recette, saveurs, photoId };
  result = await BoissonDAO.UpdateOne(id, data);
  return res
    .status(200)
    .json({ message: `Boisson mis à jour avec succès`, data: result });
}
async function deleteOneBoisson(req, res) {
  const id = req.params.id;
  const existingBoisson = await BoissonDAO.ReadById(id);
  if (!existingBoisson) {
    return res
      .status(404)
      .json({ message: `Boisson introuvable ou inexistante` });
  }
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  result = await BoissonDAO.DeleteOne(id);
  return res.status(200).json({
    data: result,
  });
}
export const BoissonController = {
  createBoisson,
  readAllBoissons,
  readOneBoissonById,
  readBoissonsByFamille,
  readBoissonsByType,
  readBoissonsBySaveurs,
  updateOneBoisson,
  deleteOneBoisson,
};
