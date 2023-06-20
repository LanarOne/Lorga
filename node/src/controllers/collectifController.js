import { isAdmin } from "../utils/adminUtils.js";
import { stringIsFilled } from "../utils/stringUtils.js";
import { CollectifDAO } from "../DAOs/collectifDAO.js";
import Collectif from "../models/Collectif.js";
import { UserDAO } from "../DAOs/userDAO.js";

const createCollectif = async (req, res) => {
  const userId = req.params.id;
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: `Veuillez vous enregistrer ou vous connecter` });
  }
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res
      .status(403)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  try {
    const { nom, description, influences, style, photoId } = req.body;
    const existingNomDeCollectif = await Collectif.findOne({ where: { nom } });
    if (existingNomDeCollectif) {
      return res
        .status(409)
        .json({ message: `Un collectif porte déjà ce nom` });
    }
    if (
      !stringIsFilled(nom) ||
      !stringIsFilled(description) ||
      !stringIsFilled(influences) ||
      !stringIsFilled(style) ||
      !photoId ||
      !userId
    ) {
      return res
        .status(406)
        .json({ message: `Tous les champs doivent être remplis` });
    }
    const collectif = await CollectifDAO.Create(
      nom,
      description,
      influences,
      style,
      photoId,
      userId
    );
    let id = userId;
    if (admin >= 4) {
      return res.status(201).json({
        message: `Collectif ${collectif.nom} créé avec succès`,
        data: collectif,
      });
    }
    const updateRoleId = await UserDAO.UpdateRoleId(id, 4);
    return res.status(201).json({
      message: `Collectif ${collectif.nom} créé avec succès`,
      data: collectif,
      updateRoleId,
    });
  } catch (error) {
    return Error(error.message);
  }
};

const readAllCollectifs = async (req, res) => {
  const collectifs = await CollectifDAO.ReadAll();
  if (!collectifs) {
    return res
      .status(404)
      .json({ message: `Impossible de récupérer la liste des collectifs` });
  }
  return res.status(200).json({
    message: `Liste des collectifs récupérée avec succès`,
    data: collectifs,
  });
};

const readOneCollectif = async (req, res) => {
  const id = req.params.id;
  const collectif = await CollectifDAO.ReadById(id);
  if (!collectif) {
    return res
      .status(404)
      .json({ message: `Collectif inexistant ou introuvable` });
  }
  return res.status(200).json({
    message: `Collectif ${collectif.nom} trouvé avec succès`,
    data: collectif,
  });
};

const updateOneCollectif = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res.status(401).json({
      message: `Veuillez vous identifier ou vous inscrire pour accéder à ces informations`,
    });
  }
  const id = req.params.id;
  const { nom, description, influences, style, photoId } = req.body;
  if (
    !stringIsFilled(nom) ||
    !stringIsFilled(description) ||
    !stringIsFilled(influences) ||
    !stringIsFilled(style) ||
    !photoId
  ) {
    return res.status(406).json({
      message: `Tous les champs doivent être remplis pour validation`,
    });
  }
  const data = { nom, description, influences, style, photoId };
  const collectif = await CollectifDAO.UpdateOne(id, data);
  if (!collectif) {
    return res
      .status(404)
      .json({ message: `Collectif inexistant ou introuvable` });
  }
  return res.status(200).json({
    message: `Collectif ${collectif.nom} mis à jour avec succès`,
    data: collectif,
  });
};

const deleteOneCollectif = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res.status(401).json({
      message: `Veuillez vous identifier ou vous inscrire pour accéder à ces informations`,
    });
  }
  const id = req.params.id;
  const collectif = await CollectifDAO.DeleteOne(id);
  if (!collectif) {
    return res
      .status(404)
      .json({ message: `Collectif introuvable ou inexistant` });
  }
  return res
    .status(200)
    .json({ message: `Collectif supprimé avec succès de la base de données` });
};
export const CollectifController = {
  createCollectif,
  readAllCollectifs,
  readOneCollectif,
  updateOneCollectif,
  deleteOneCollectif,
};
