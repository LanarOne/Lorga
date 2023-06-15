import { stringIsFilled } from "../utils/stringUtils.js";
import Lien from "../models/Lien.js";
import { LienDAO } from "../DAOs/lienDAO.js";
import { isAdmin } from "../utils/adminUtils.js";

const createLien = async (req, res) => {
  let result = null;
  try {
    const { url, artisteId, collectifId } = req.body;
    if (!stringIsFilled(url)) {
      return res
        .status(400)
        .json({ message: `Tous les champs sont obligatoires` });
    }
    const existingLien = await Lien.findOne({ where: { url } });
    if (existingLien) {
      return res
        .status(409)
        .json({ message: `Ce lien est déjà présent en base de données` });
    }
    result = await LienDAO.Create(url, artisteId, collectifId);
    return res
      .status(201)
      .json({ message: `Lien enregistré avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const readAllLiens = async function readAll(req, res) {
  let result = null;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  result = await LienDAO.ReadAll();
  if (!result) {
    return res.status(404).json({ message: `Lien introuvable ou inexistant` });
  }
  return res
    .status(200)
    .json({ message: `Liste des liens trouvée avec succès`, data: result });
};

const readOneById = async function readById(req, res) {
  let result = null;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  const id = req.params.id;
  result = await LienDAO.ReadById(id);
  if (!result) {
    return res.status(404).json({ message: `Lien introuvable ou inexistant` });
  }
  return res
    .status(200)
    .json({ message: `Lien récupéré avec succès`, data: result });
};

const readByArtisteId = async function readByArtiste(req, res) {
  let result = null;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  const artisteId = req.params.id;
  result = await LienDAO.ReadByArtisteId(artisteId);
  if (!result || result.length === 0) {
    return res
      .status(404)
      .json({ message: `Liste des liens introuvable ou inexistante` });
  }
  return res
    .status(200)
    .json({ message: `Liste de liens récupérée avec succès`, data: result });
};

const readByCollectifId = async function readByCollectif(req, res) {
  let result = null;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  const collectifId = req.params.id;
  result = await LienDAO.ReadByCollectifId(collectifId);
  if (!result || result.length === 0) {
    return res
      .status(404)
      .json({ message: `Liste des liens introuvable ou inexistante` });
  }
  return res
    .status(200)
    .json({ message: `Liste de liens récupérée avec succès`, data: result });
};

const updateOneLien = async function updateone(req, res) {
  let result = null;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  const id = req.params.id;
  const { url, artisteId, collectifId } = req.body;
  if (!stringIsFilled(url)) {
    return res
      .status(406)
      .json({ message: `Tous les champs sont obligatoires` });
  }
  if (!artisteId && !collectifId) {
    return res.status(406).json({ message: `ID manquant` });
  }
  const data = { url, artisteId, collectifId };
  result = await LienDAO.UpdateOne(id, data);
  if (!result) {
    return res.status(404).json({ message: `Lien introuvable ou inexistant` });
  }
  return res
    .status(200)
    .json({ message: `Lien mis à jour avec succès`, data: result });
};

const deleteOneLien = async function deleteOne(req, res) {
  let result = null;
  const id = req.params.id;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  result = await LienDAO.DeleteOne(id);
  if (!result || !id) {
    return res.status(404).json({ message: `Lien introuvable ou inexistant` });
  }
  return res
    .status(200)
    .json({ message: `Le lien a bien été supprimé de la base de données` });
};
export const LienController = {
  createLien,
  readAllLiens,
  readOneById,
  readByArtisteId,
  readByCollectifId,
  updateOneLien,
  deleteOneLien,
};
