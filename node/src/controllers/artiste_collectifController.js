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

async function readAll(req, res) {
  let result = null;
  try {
    result = await Artiste_CollectifDAO.ReadAll();
    if (!result || result.length === 0) {
      return res.status(404).json({
        message: `Artiste lié à des collectifs introuvable ou inexistante`,
      });
    }
    return res.status(200).json({
      message: `Liste des artistes liés à des collectifs récupérée avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function readByArtisteId(req, res) {
  let result = null;
  const artisteId = req.params.id;
  try {
    result = await Artiste_CollectifDAO.ReadByArtisteId(artisteId);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Artiste introuvable ou inexistant` });
    }
    return res.status(200).json({
      message: `Artiste lié à des collectifs récupéré avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function readByCollectifId(req, res) {
  let result = null;
  const collectifId = req.params.id;
  try {
    result = await Artiste_CollectifDAO.ReadByCollectifId(collectifId);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Liste du collectif introuvable ou inexistante` });
    }
    const artistes = [];

    for (const artisteCollectif of result) {
      const artisteId = artisteCollectif.artisteId;
      const artiste = await ArtisteDAO.ReadById(artisteId);
      artistes.push(artiste);
    }
    return res.status(200).json({
      message: `Liste des artistes du collectif récupérée avec succès`,
      data: artistes,
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function deleteOne(req, res) {
  let result = null;
  const id = req.params.id;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res.status(401).json({
      message: `Veuillez vous identifiez ou vous inscrire pour accéder à ces informations`,
    });
  }
  try {
    const existingEntry = await Artiste_CollectifDAO.ReadById(id);
    if (!existingEntry) {
      return res
        .status(404)
        .json({ message: `Entrée introuvable ou inexistante` });
    }
    result = await Artiste_CollectifDAO.DeleteOne(id);
    return res
      .status(200)
      .json({ message: `Entrée correctement supprimé de la base de données` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
}
export const Artiste_CollectifController = {
  createArtiste_Collectif,
  readAll,
  readByArtisteId,
  readByCollectifId,
  deleteOne,
};
