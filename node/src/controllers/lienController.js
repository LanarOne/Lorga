import { stringIsFilled } from "../utils/stringUtils.js";
import { LienDAO } from "../DAOs/lienDAO.js";
import { isAdmin } from "../utils/adminUtils.js";
import { ArtisteDAO } from "../DAOs/artisteDAO.js";
import { CollectifDAO } from "../DAOs/collectifDAO.js";

const createLien = async (req, res) => {
  let result = null;
  try {
    const { url, artisteId, collectifId } = req.body;
    if (!stringIsFilled(url)) {
      return res
        .status(400)
        .json({ message: `Tous les champs sont obligatoires` });
    }
    if (artisteId) {
      const existingArtiste = await ArtisteDAO.ReadById(artisteId);
      if (!existingArtiste) {
        return res
          .status(404)
          .json({ message: `Artiste introuvable ou inexistant` });
      }
    }
    if (collectifId) {
      const existingCollectif = await CollectifDAO.ReadById(collectifId);
      if (!existingCollectif) {
        return res
          .status(404)
          .json({ message: `Collectif introuvable ou inexistant` });
      }
    }
    result = await LienDAO.Create(url, artisteId, collectifId);
    return res
      .status(201)
      .json({ message: `Lien enregistré avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readAllLiens = async function readAll(req, res) {
  try {
    let result = null;
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (admin === 1) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
    }
    result = await LienDAO.ReadAll();
    if (!result) {
      return res
        .status(404)
        .json({ message: `Lien introuvable ou inexistant` });
    }
    return res
      .status(200)
      .json({ message: `Liste des liens trouvée avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readOneById = async function readById(req, res) {
  try {
    let result = null;
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (admin === 1) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
    }
    const id = req.params.id;
    result = await LienDAO.ReadById(id);
    if (!result) {
      return res
        .status(404)
        .json({ message: `Lien introuvable ou inexistant` });
    }
    return res
      .status(200)
      .json({ message: `Lien récupéré avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readByArtisteId = async function readByArtiste(req, res) {
  try {
    let result = null;
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (admin === 1) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
    }
    const artisteId = req.params.id;
    result = await LienDAO.ReadByArtisteId(artisteId);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Liste des liens introuvable ou inexistante` });
    }
    return res
      .status(200)
      .json({ message: `Liste de liens récupérée avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readByCollectifId = async function readByCollectif(req, res) {
  try {
    let result = null;
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (admin === 1) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
    }
    const collectifId = req.params.id;
    result = await LienDAO.ReadByCollectifId(collectifId);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Liste des liens introuvable ou inexistante` });
    }
    return res
      .status(200)
      .json({ message: `Liste de liens récupérée avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const updateOneLien = async function updateone(req, res) {
  try {
    let result = null;
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (admin === 1) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
    }
    const id = req.params.id;
    const existingLien = await LienDAO.ReadById(id);
    if (!existingLien) {
      return res
        .status(404)
        .json({ message: `Lien introuvable ou inexistant` });
    }
    const { url, artisteId, collectifId } = req.body;
    if (!stringIsFilled(url)) {
      return res
        .status(406)
        .json({ message: `Tous les champs sont obligatoires` });
    }
    if (!artisteId && !collectifId) {
      return res.status(406).json({ message: `ID manquant` });
    }
    if (artisteId) {
      const existingArtiste = await ArtisteDAO.ReadById(artisteId);
      if (!existingArtiste) {
        return res
          .status(404)
          .json({ message: `Artiste introuvable ou inexistant` });
      }
    }
    if (collectifId) {
      const existingCollectif = await CollectifDAO.ReadById(collectifId);
      if (!existingCollectif) {
        return res
          .status(404)
          .json({ message: `Collectif introuvable ou inexistant` });
      }
    }
    const data = { url, artisteId, collectifId };
    result = await LienDAO.UpdateOne(id, data);
    return res
      .status(200)
      .json({ message: `Lien mis à jour avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const deleteOneLien = async function deleteOne(req, res) {
  try {
    let result = null;
    const id = req.params.id;
    const existingLien = await LienDAO.ReadById(id);
    if (!existingLien) {
      return res
        .status(404)
        .json({ message: `Lien introuvable ou inexistant` });
    }
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (admin === 1) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
    }
    result = await LienDAO.DeleteOne(id);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};
export const LienController = {
  createLien,
  readAllLiens,
  readOneById,
  readByArtisteId,
  readByCollectifId,
  updateOneLien,
  deleteOneLien,
};
