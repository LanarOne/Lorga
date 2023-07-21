import { ArtisteDAO } from "../DAOs/artisteDAO.js";
import { isAdmin } from "../utils/adminUtils.js";
import { CollectifDAO } from "../DAOs/collectifDAO.js";
import { Artiste_CollectifDAO } from "../DAOs/artiste_collectifDAO.js";

async function createArtiste_Collectif(req, res) {
  let result = null;
  let confirmation = false;
  try {
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
    const artisteId = parseInt(req.params.id);
    const artiste = await ArtisteDAO.ReadById(artisteId);
    if (!artiste) {
      return res
        .status(404)
        .json({ message: `Artiste introuvable ou inexistant` });
    }
    if (!artiste.confirmation) {
      return res.status(401).json({
        message: `Le profil artiste doit être validé avant de rentrer dans un collectif`,
      });
    }

    const { collectifId } = req.body;
    const existingCollectif = await CollectifDAO.ReadById(collectifId);
    if (!existingCollectif) {
      return res
        .status(404)
        .json({ message: `Collectif introuvable ou inexistant` });
    }
    if (!existingCollectif.confirmation) {
      return res.status(401).json({
        message: `Le profil collectif doit être validé avant d'accepeter des artistes`,
      });
    }
    result = await Artiste_CollectifDAO.Create(
      confirmation,
      artisteId,
      collectifId
    );
    if (!result || result.length === 0) {
      return res.status(500).json({ message: `Erreur interne du server` });
    }
    return res.status(201).json({
      message: `Artiste ${artiste.nom} lié au collectif ${existingCollectif.nom} avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: result });
  }
}

const confirmArtCol = async (req, res) => {
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
    const art_col = await Artiste_CollectifDAO.ReadById(id);
    if (!art_col || art_col.length === 0) {
      return res
        .status(404)
        .json({ message: `Artiste du collectif introuvable ou inexistant` });
    }
    let confirmation = !art_col.confirmation;
    result = await Artiste_CollectifDAO.Confirm(id, confirmation);
    if (!result || result.length === 0) {
      return res.status(500).json({ message: `Erreur interne du server` });
    }
    return res.status(200).json({
      message: `Artiste dans le collectif confirmé avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

async function readAll(req, res) {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin <= 4) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
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
    return res.status(500).json({ message: `Erreur interne`, data: result });
  }
}

async function readUnconfirmed(req, res) {
  let result = null;
  try {
    result = await Artiste_CollectifDAO.ReadUnconfirmedArtCol();
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Liste introuvable ou inexistante` });
    }
    return res.status(200).json({
      message: `Liste des artistes dans le collectif non confirmés récupérée avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
}

async function readByArtisteId(req, res) {
  let result = null;
  const artisteId = parseInt(req.params.id);
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
    return res.status(500).json({ message: `Erreur interne`, data: result });
  }
}

async function readByCollectifId(req, res) {
  let result = null;
  const collectifId = parseInt(req.params.id);

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
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
}

async function deleteOne(req, res) {
  let result = null;
  const id = parseInt(req.params.id);
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
    return res.status(200).json({
      message: `Entrée correctement supprimé de la base de données`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
}
export const Artiste_CollectifController = {
  createArtiste_Collectif,
  confirmArtCol,
  readAll,
  readUnconfirmed,
  readByArtisteId,
  readByCollectifId,
  deleteOne,
};
