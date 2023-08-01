import { PhotoDAO } from "../DAOs/photoDAO.js";
import { stringIsFilled } from "../utils/stringUtils.js";

const create = async (req, res) => {
  try {
    let { alt } = req.body;
    const nom = req.file.filename;
    const path = req.file.path;
    if (!stringIsFilled(nom) || !stringIsFilled(path) || !stringIsFilled(alt)) {
      return res
        .status(400)
        .json({ message: `Veuillez remplir tous les champs` });
    }
    const photo = await PhotoDAO.Create(nom, path, alt);
    return res.status(201).json({
      message: `Photo créée avec succès`,
      data: photo,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: `Internal Server Error`, data: error });
  }
};

const readAll = async (req, res) => {
  let result = null;
  try {
    result = await PhotoDAO.ReadAllPhotos();
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Impossible de charger la liste des photos` });
    }
    return res.status(200).json({
      message: `Liste des photos récupérée avec succès`,
      data: result,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: `Erreur interne` });
  }
};

const readById = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await PhotoDAO.ReadPhotoById(id);
    if (!photo) {
      return res
        .status(404)
        .json({ message: `Photo introuvable ou inexistante` });
    }
    return res.status(200).json({
      message: `Photo trouvée avec succès`,
      data: photo,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    let { nom, path, alt } = req.body;
    const data = { nom, path, alt };
    const updatedPhoto = await PhotoDAO.UpdatePhoto(id, data);
    if (!updatedPhoto) {
      return res
        .status(404)
        .json({ message: `Photo introuvable ou inexistante` });
    }
    return res.status(200).json({
      message: `Photo mis à jour avec succès`,
      data: updatedPhoto,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PhotoDAO.DeletePhoto(id);
    if (!result) {
      return res
        .status(404)
        .json({ message: `Photo introuvable ou inexistante` });
    }
    return res.status(200).json({
      message: `Photo supprimé avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

export const PhotoController = {
  create,
  readAll,
  readById,
  update,
  remove,
};
