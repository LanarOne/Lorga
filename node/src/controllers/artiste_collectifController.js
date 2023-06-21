import { ArtisteDAO } from "../DAOs/artisteDAO.js";
import { isAdmin } from "../utils/adminUtils.js";
import { CollectifDAO } from "../DAOs/collectifDAO.js";
import { Artiste_CollectifDAO } from "../DAOs/artiste_collectifDAO.js";

async function createArtiste_Collectif(req, res) {
  let result = null;
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
  const artisteId = req.params.id;
  const artiste = await ArtisteDAO.ReadById(artisteId);
  if (!artiste) {
    return res
      .status(404)
      .json({ message: `Artiste introuvable ou inexistant` });
  }
  try {
    const { collectifId } = req.body;
    const existingCollectif = await CollectifDAO.ReadById(collectifId);
    if (!existingCollectif) {
      return res
        .status(404)
        .json({ message: `Collectif introuvable ou inexistant` });
    }
    result = await Artiste_CollectifDAO.Create(artisteId, collectifId);
    return res.status(201).json({
      message: `Artiste ${artiste.nom} lié au collectif ${existingCollectif.nom} avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

export const Artiste_CollectifController = { createArtiste_Collectif };
