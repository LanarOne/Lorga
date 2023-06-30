import { isAdmin } from "../utils/adminUtils.js";
import { stringIsFilled } from "../utils/stringUtils.js";
import { CollectifDAO } from "../DAOs/collectifDAO.js";
import Collectif from "../models/Collectif.js";
import { UserDAO } from "../DAOs/userDAO.js";
import { Admin_CollectifDAO } from "../DAOs/admin_collectifDAO.js";

const createCollectif = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = decodeURIComponent(req.headers.authorization);
    if (!token) {
      return res
        .status(401)
        .json({ message: `Veuillez vous enregistrer ou vous connecter` });
    }
    const admin = await isAdmin(token);
    if (!admin) {
      return res
        .status(403)
        .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
    }
    if (admin === 4) {
      return res
        .status(400)
        .json({ message: `Vous ne pouvez créer qu'un seul collectif` });
    }
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
    const user = await UserDAO.ReadUserById(id);
    if (user.roleId >= 4) {
      const collectifId = collectif.id;
      const admin_collectif = await Admin_CollectifDAO.Create(
        userId,
        collectifId
      );
      return res.status(201).json({
        message: `Collectif ${collectif.nom} créé avec succès`,
        data: collectif,
        admin_collectif,
      });
    }
    const collectifId = collectif.id;
    const admin_collectif = await Admin_CollectifDAO.Create(
      userId,
      collectifId
    );
    const updateRoleId = await UserDAO.UpdateRoleId(id, 4);
    return res.status(201).json({
      message: `Collectif ${collectif.nom} créé avec succès`,
      data: collectif,
      updateRoleId,
      admin_collectif,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readAllCollectifs = async (req, res) => {
  let result = null;
  try {
    result = await CollectifDAO.ReadAll();
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Impossible de récupérer la liste des collectifs` });
    }
    return res.status(200).json({
      message: `Liste des collectifs récupérée avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readOneCollectif = async (req, res) => {
  let result = null;
  try {
    const id = req.params.id;
    result = await CollectifDAO.ReadById(id);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Collectif inexistant ou introuvable` });
    }
    return res.status(200).json({
      message: `Collectif ${result.nom} trouvé avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const updateOneCollectif = async (req, res) => {
  try {
    let result = null;
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (!admin || admin === 1) {
      return res.status(401).json({
        message: `Veuillez vous identifier ou vous inscrire pour accéder à ces informations`,
      });
    }
    const id = req.params.id;
    const collectif = CollectifDAO.ReadById(id);
    if (!collectif) {
      return res
        .status(404)
        .json({ message: `Collectif inexistant ou introuvable` });
    }
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
    result = await CollectifDAO.UpdateOne(id, data);
    return res.status(200).json({
      message: `Collectif ${collectif.nom} mis à jour avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const deleteOneCollectif = async (req, res) => {
  try {
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
    return res.status(200).json({
      message: `Collectif supprimé avec succès de la base de données`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};
export const CollectifController = {
  createCollectif,
  readAllCollectifs,
  readOneCollectif,
  updateOneCollectif,
  deleteOneCollectif,
};
