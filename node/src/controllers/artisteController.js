import { stringIsFilled } from "../utils/stringUtils.js";
import { isAdmin } from "../utils/adminUtils.js";
import { ArtisteDAO } from "../DAOs/artisteDAO.js";
import Artiste from "../models/Artiste.js";
import { UserDAO } from "../DAOs/userDAO.js";

const createArtiste = async (req, res) => {
  const userId = parseInt(req.params.id);
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: `Veuillez vous enregistrer` });
  }
  const admin = await isAdmin(token);
  if (!admin) {
    return res
      .status(403)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  try {
    const { nom, description, influences, style, photoId } = req.body;
    const confirmation = false;
    const existingNomArtiste = await Artiste.findOne({ where: { nom } });
    const existingArtiste = await Artiste.findOne({ where: { userId } });
    if (existingNomArtiste) {
      return res.status(409).json({ message: `Un artiste porte déjà ce nom` });
    } else if (existingArtiste) {
      return res
        .status(409)
        .json({ message: `Une page artiste est déjà liée à cet utilisateur` });
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
    const artiste = await ArtisteDAO.Create(
      nom,
      description,
      influences,
      style,
      confirmation,
      photoId,
      userId
    );
    const user = await UserDAO.ReadUserById(userId);
    if (user.roleId >= 2) {
      return res.status(201).json({
        message: `Artiste ${artiste.nom} créé avec succès`,
        data: artiste,
      });
    }
    const updateRoleId = await UserDAO.UpdateRoleId(userId, 2);
    return res.status(201).json({
      message: `Artiste ${artiste.nom} créé avec succès`,
      data: artiste,
      updateRoleId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const confirmArtiste = async (req, res) => {
  let result = null;
  try {
    const id = parseInt(req.params.id);
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (!admin || admin <= 4) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
    }
    const artiste = await ArtisteDAO.ReadById(id);
    if (!artiste || artiste.length === 0) {
      return res
        .status(404)
        .json({ message: `Artiste inexistant ou introuvable` });
    }
    let confirmation = !artiste.confirmation;
    result = await ArtisteDAO.Confirm(id, confirmation);
    return res
      .status(200)
      .json({ message: `Artiste confirmé avec succès`, data: result });
  } catch (error) {
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readAllArtistes = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin <= 4) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  try {
    const artistes = await ArtisteDAO.ReadAll();
    if (!artistes || artistes.length === 0) {
      return res
        .status(404)
        .json({ message: `Impossible de récupérer la liste des artistes` });
    }
    return res.status(200).json({
      message: `Liste des artistes récupérée avec succès`,
      data: artistes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readConfirmedArtistes = async (req, res) => {
  let result = null;
  try {
    result = await ArtisteDAO.ReadConfirmedArtistes();
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Impossible de récupérer la liste` });
    }
    return res.status(200).json({
      message: `Liste des artistes triés par confirmation positive récupérée avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readUnconfirmedArtistes = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin <= 4) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  let result = null;
  try {
    result = await ArtisteDAO.ReadUnconfirmedArtistes();
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Impossible de récupérer la liste` });
    }
    return res.status(200).json({
      message: `Liste des artistes triés par absence de confirmation récupérée avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};
const readOneArtiste = async (req, res) => {
  let result = null;
  try {
    const id = parseInt(req.params.id);
    result = await ArtisteDAO.ReadById(id);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Artiste inexistant ou impossible à trouver` });
    }
    return res.status(200).json({
      message: `Artiste ${result.nom} trouvé avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readByUserId = async (req, res) => {
  let result = null;
  try {
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (!admin || admin === 1) {
      return res.status(401).json({
        message: `Veuillez vous identifier ou vous inscrire pour accéder à ces informations`,
      });
    }
    const userId = parseInt(req.params.id);
    const user = await UserDAO.ReadUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: `Utilisateur introuvable ou inexistant` });
    }
    result = await ArtisteDAO.ReadByUserId(userId);
    return res
      .status(200)
      .json({ message: `Artiste récupéré avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readByNom = async (req, res) => {
  const nom = req.params.nom;
  let result = null;
  try {
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (!admin) {
      return res.status(401).json({
        message: `Veuillez vous identifier ou vous inscrire pour accéder à ces informations`,
      });
    }
    result = await ArtisteDAO.ReadByArtisteNom(nom);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Artiste introuvable ou inexistant` });
    }
    return res.status(200).json({
      message: `Artiste ${result.nom} trouvé avec succès`,
      data: result,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: `Erreur interne`, data: e });
  }
};

const updateOneArtiste = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res.status(401).json({
      message: `Veuillez vous identifier ou vous inscrire pour accéder à ces informations`,
    });
  }
  try {
    const id = parseInt(req.params.id);
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
    const artiste = await ArtisteDAO.UpdateOne(id, data);
    if (!artiste) {
      return res
        .status(404)
        .json({ message: `Artiste inexistant ou introuvable` });
    }
    return res.status(200).json({
      message: `Artiste ${artiste.nom} a été mis à jour avec succès`,
      data: artiste,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const deleteOneArtiste = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res.status(401).json({
      message: `Veuillez vous identifier ou vous inscrire pour accéder à ces informations`,
    });
  }
  try {
    const id = parseInt(req.params.id);
    const existingArtiste = await ArtisteDAO.ReadById(id);
    if (!existingArtiste) {
      return res
        .status(404)
        .json({ message: `Artiste introuvable ou inexistant` });
    }
    const artiste = await ArtisteDAO.DeleteOne(id);
    return res.status(200).json({ data: artiste });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};
export const ArtisteController = {
  createArtiste,
  confirmArtiste,
  readAllArtistes,
  readConfirmedArtistes,
  readUnconfirmedArtistes,
  readOneArtiste,
  readByUserId,
  readByNom,
  updateOneArtiste,
  deleteOneArtiste,
};
