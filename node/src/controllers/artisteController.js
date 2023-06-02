import { stringIsFilled } from "../utils/stringUtils.js";
import { isAdmin } from "../utils/adminUtils.js";
import { ArtisteDAO } from "../DAOs/artisteDAO.js";
import artiste from "../models/Artiste.js";

const createArtiste = async (req, res) => {
  const userId = req.params.id;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!token) {
    return res.status(401).json({ message: `Veuillez vous enregistrer` });
  }
  try {
    const { nom, description, influences, style, photoId } = req.body;
    if (admin === 1) {
      return res
        .status(403)
        .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
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

export const ArtisteController = { createArtiste };
