import Collectif from "../models/Collectif.js";

const Create = async (
  nom,
  description,
  influences,
  style,
  confirmation,
  createurId,
  photoId
) => {
  let result = null;
  try {
    result = Collectif.create({
      nom,
      description,
      influences,
      style,
      confirmation,
      createurId,
      photoId,
      // userId,
    });
    return result;
  } catch (error) {
    return Error(error.message);
  }
};

const ConfirmCollectif = async (id, confirmation) => {
  let result = null;
  try {
    const collectif = await Collectif.findByPk(id);
    if (!collectif || collectif.length === 0) {
      return result;
    }
    result = await Collectif.update({ confirmation }, { where: { id } });
    return result;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
};
const ReadAll = async () => {
  let result = null;
  try {
    result = await Collectif.findAll();

    return result.map((collectif) => {
      return {
        collectifId: collectif.id,
        nom: decodeURIComponent(collectif.nom),
        description: decodeURIComponent(collectif.description),
        influences: decodeURIComponent(collectif.influences),
        style: decodeURIComponent(collectif.style),
        confirmation: collectif.confirmation,
        photoId: collectif.photoId,
      };
    });
  } catch (error) {
    return Error(error.message);
  }
};

const ReadConfirmedCollectifs = async () => {
  let result = null;
  let confirmation = true;
  try {
    result = await Collectif.findAll({ where: { confirmation } });
    return result.map((collectif) => {
      return {
        nom: decodeURIComponent(collectif.nom),
        description: decodeURIComponent(collectif.description),
        influences: decodeURIComponent(collectif.influences),
        style: decodeURIComponent(collectif.style),
        confirmation: collectif.confirmation,
        photoId: collectif.photoId,
      };
    });
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
};

const ReadUnconfirmedCollectifs = async () => {
  let result = null;
  let confirmation = false;
  try {
    result = await Collectif.findAll({ where: { confirmation } });
    return result.map((collectif) => {
      return {
        id: collectif.id,
        nom: decodeURIComponent(collectif.nom),
        description: decodeURIComponent(collectif.description),
        influences: decodeURIComponent(collectif.influences),
        style: decodeURIComponent(collectif.style),
        confirmation: collectif.confirmation,
        photoId: collectif.photoId,
      };
    });
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
};

const ReadById = async (id) => {
  let result = null;
  try {
    result = await Collectif.findByPk(id);
    if (!result || result.length === 0) {
      return;
    }
    return {
      nom: decodeURIComponent(result.nom),
      description: decodeURIComponent(result.description),
      influences: decodeURIComponent(result.influences),
      style: decodeURIComponent(result.style),
      confirmation: result.confirmation,
      photoId: result.photoId,
    };
  } catch (error) {
    return Error(error.message);
  }
};

const ReadByNom = async (nom) => {
  let result = null;
  try {
    result = await Collectif.findOne({ where: { nom } });
    if (!result || result.length === 0) {
      return;
    }
    return {
      id: result.id,
      nom: decodeURIComponent(result.nom),
      description: decodeURIComponent(result.description),
      influences: decodeURIComponent(result.influences),
      style: decodeURIComponent(result.style),
      confirmation: result.confirmation,
      photoId: result.photoId,
    };
  } catch (e) {
    throw e;
  }
};

const ReadByCreateur = async (createurId) => {
  let result = null;
  try {
    result = await Collectif.findOne({ where: { createurId } });
    if (!result || result.length === 0) {
      return;
    }
    return {
      id: result.id,
      nom: decodeURIComponent(result.nom),
      description: decodeURIComponent(result.description),
      influences: decodeURIComponent(result.influences),
      style: decodeURIComponent(result.style),
      confirmation: result.confirmation,
      photoId: result.photoId,
    };
  } catch (e) {
    throw e;
  }
};

const UpdateOne = async (id, data) => {
  let result = null;
  try {
    let collectif = await Collectif.findByPk(id);
    const { nom, description, influences, style, confirmation, photoId } = data;
    if (!collectif) {
      return;
    }
    result = await collectif.update({
      nom,
      description,
      influences,
      style,
      confirmation,
      photoId,
    });
    return result;
  } catch (error) {
    return Error(error.message);
  }
};

const DeleteOne = async (id) => {
  let result = null;
  let message = `Le collectif a été retiré de la base de donnée`;
  try {
    result = await Collectif.findByPk(id);
    if (!result) {
      return;
    }
    await result.destroy();
    return message;
  } catch (error) {
    return Error(error.message);
  }
};
export const CollectifDAO = {
  Create,
  ConfirmCollectif,
  ReadAll,
  ReadConfirmedCollectifs,
  ReadUnconfirmedCollectifs,
  ReadById,
  ReadByNom,
  ReadByCreateur,
  UpdateOne,
  DeleteOne,
};
