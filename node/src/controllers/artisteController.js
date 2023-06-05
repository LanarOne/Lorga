import { stringIsFilled } from "../utils/stringUtils.js";
import { isAdmin } from "../utils/adminUtils.js";
import { ArtisteDAO } from "../DAOs/artisteDAO.js";
import Artiste from "../models/Artiste.js";

const createArtiste = async (req, res) => {
  const userId = req.params.id;
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: `Veuillez vous enregistrer` });
  }
  const admin = await isAdmin(token);
  if (admin === 1) {
    return res
      .status(403)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  try {
    const { nom, description, influences, style, photoId } = req.body;
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
      photoId,
      userId
    );
    return res.status(201).json({
      message: `Artiste ${artiste.nom} créé avec succès`,
      data: artiste,
    });
  } catch (error) {
    return Error(error.message);
  }
};

const readAllArtistes = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin) {
    return res.status(401).json({
      message: `Veuillez vous identifiez ou vous inscrire pour accéder à ces informations`,
    });
  }
  const artistes = await ArtisteDAO.ReadAll();
  if (!artistes) {
    return res
      .status(404)
      .json({ message: `Impossible de récupérer la liste des artistes` });
  }
  return res.status(200).json({
    message: `Liste des artistes récupérée avec succès`,
    data: artistes,
  });
};

const readOneArtiste = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res.status(401).json({
      message: `Veuillez vous identifiez ou vous inscrire pour accéder à ces informations`,
    });
  }
  const id = req.params.id;
  const artiste = await ArtisteDAO.ReadById(id);
  if (!artiste) {
    return res
      .status(404)
      .json({ message: `Artiste inexistant ou impossible à trouver` });
  }
  return res.status(200).json({
    message: `artiste ${artiste.nom} trouvé avec succès`,
    data: artiste,
  });
};

const updateOneArtiste = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res.status(401).json({
      message: `Veuillez vous identifier ou vous inscrire pour accéder à ces informations`,
    });
  }
  const id = req.params.id;
  const { nom, description, influences, style } = req.body;
  if (
    !stringIsFilled(nom) ||
    !stringIsFilled(description) ||
    !stringIsFilled(influences) ||
    !stringIsFilled(style)
  ) {
    return res.status(406).json({
      message: `Tous les champs doivent être remplis pour validation`,
    });
  }
  const data = { nom, description, influences, style };
  const artiste = await ArtisteDAO.UpdateOne(id, data);
  if (!artiste) {
    return res
      .status(404)
      .json({ message: `Impossible de trouver cet artiste` });
  }
  return res.status(200).json({
    message: `Artiste ${artiste.nom} a été mis à jour avec succès`,
    data: artiste,
  });
};

const deleteOneArtiste = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res.status(401).json({
      message: `Veuillez vous identifier ou vous inscrire pour accéder à ces informations`,
    });
  }
  const id = req.params.id;
  const artiste = await ArtisteDAO.DeleteOne(id);
  if (!artiste) {
    return res
      .status(404)
      .json({ message: `Impossible de trouver cet artiste` });
  }
  return res
    .status(200)
    .json({ message: `Artiste supprimé avec succès de la base de données` });
};
export const ArtisteController = {
  createArtiste,
  readAllArtistes,
  readOneArtiste,
  updateOneArtiste,
  deleteOneArtiste,
};
