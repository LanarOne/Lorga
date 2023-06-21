import { stringIsFilled } from "../utils/stringUtils.js";
import { isAdmin } from "../utils/adminUtils.js";
import { ArtisteDAO } from "../DAOs/artisteDAO.js";
import Artiste from "../models/Artiste.js";
import { UserDAO } from "../DAOs/userDAO.js";

const createArtiste = async (req, res) => {
  const userId = req.params.id;
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: `Veuillez vous enregistrer` });
  }
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
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
    if (admin >= 3) {
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
    return Error(error.message);
  }
};

const readAllArtistes = async (req, res) => {
  // const token = req.headers.authorization;
  // const admin = await isAdmin(token);
  // if (!admin) {
  //   return res.status(401).json({
  //     message: `Veuillez vous identifiez ou vous inscrire pour accéder à ces informations`,
  //   });
  // }
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
  const id = req.params.id;
  const artiste = await ArtisteDAO.ReadById(id);
  if (!artiste) {
    return res
      .status(404)
      .json({ message: `Artiste inexistant ou impossible à trouver` });
  }
  return res.status(200).json({
    message: `Artiste ${artiste.nom} trouvé avec succès`,
    data: artiste,
  });
};

const readByUserId = async (req, res) => {
  let result = null;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res.status(401).json({
      message: `Veuillez vous identifier ou vous inscrire pour accéder à ces informations`,
    });
  }
  const userId = req.params.id;
  let id = userId;
  const user = await UserDAO.ReadUserById(id);
  if (!user) {
    return res
      .status(404)
      .json({ message: `Utilisateur introuvable ou inexistant` });
  }
  try {
    result = await ArtisteDAO.ReadByUserId(userId);
    return res
      .status(200)
      .json({ message: `Artiste récupéré avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return Error(error.message);
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
  const existingArtiste = await ArtisteDAO.ReadById(id);
  if (!existingArtiste) {
    return res
      .status(404)
      .json({ message: `Artiste introuvable ou inexistant` });
  }
  const artiste = await ArtisteDAO.DeleteOne(id);
  return res.status(200).json({ data: artiste });
};
export const ArtisteController = {
  createArtiste,
  readAllArtistes,
  readOneArtiste,
  readByUserId,
  updateOneArtiste,
  deleteOneArtiste,
};
