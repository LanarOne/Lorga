import { isAdmin } from "../utils/adminUtils.js";
import { stringIsFilled } from "../utils/stringUtils.js";
import { CollectifDAO } from "../DAOs/collectifDAO.js";
import Collectif from "../models/Collectif.js";

const createCollectif = async (req, res) => {
  const userId = req.params.id;
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: `Veuillez vous enregistrer ou vous connecter` });
  }
  const admin = await isAdmin(token);
  if (admin === 1) {
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
    return res.status(201).json({
      message: `Collectif ${collectif.nom} créé avec succès`,
      data: collectif,
    });
  } catch (error) {
    return Error(error.message);
  }
};
export const CollectifController = { createCollectif };
