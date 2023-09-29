import Artiste from "../models/Artiste.js";
const Create = async (
  nom,
  description,
  influences,
  style,
  confirmation,
  photoId,
  userId
) => {
  let result = null;
  try {
    result = await Artiste.create({
      nom,
      description,
      influences,
      style,
      confirmation,
      photoId,
      userId,
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const Confirm = async (id, confirmation) => {
  let result = null;
  try {
    const artiste = await Artiste.findByPk(id);
    if (!artiste || artiste.length === 0) {
      return result;
    }
    result = await Artiste.update({ confirmation }, { where: { id } });
    return result;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
};

const ReadAll = async () => {
  let result = null;
  try {
    result = await Artiste.findAll();
    return result.map((artiste) => {
      return {
        nom: decodeURIComponent(artiste.nom),
        description: decodeURIComponent(artiste.description),
        influences: decodeURIComponent(artiste.influences),
        style: decodeURIComponent(artiste.style),
        confirmation: artiste.confirmation,
        photoId: artiste.photoId,
      };
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const ReadConfirmedArtistes = async () => {
  let result = null;
  let confirmation = true;
  try {
    result = await Artiste.findAll({ where: { confirmation } });
    return result.map((artiste) => {
      return {
        nom: decodeURIComponent(artiste.nom),
        description: decodeURIComponent(artiste.description),
        influences: decodeURIComponent(artiste.influences),
        style: decodeURIComponent(artiste.style),
        photoId: artiste.photoId,
      };
    });
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
};

const ReadUnconfirmedArtistes = async () => {
  let result = null;
  let confirmation = false;
  try {
    result = await Artiste.findAll({ where: { confirmation } });
    return result.map((artiste) => {
      return {
        id: artiste.id,
        nom: decodeURIComponent(artiste.nom),
        description: decodeURIComponent(artiste.description),
        influences: decodeURIComponent(artiste.influences),
        style: decodeURIComponent(artiste.style),
        confirmation: artiste.confirmation,
        photoId: artiste.photoId,
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
    result = await Artiste.findByPk(id);
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
      userId: result.userId,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const ReadByUserId = async (userId) => {
  let result = null;
  try {
    result = await Artiste.findOne({ where: { userId } });
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
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const ReadByArtisteNom = async (nom) => {
  let result = null;
  try {
    result = await Artiste.findOne({ where: { nom } });
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
    console.error(e.message);
    throw new Error(e.message);
  }
};

const UpdateOne = async (id, data) => {
  try {
    const artiste = await Artiste.findByPk(id);
    const { nom, description, influences, style, confirmation, photoId } = data;
    if (!artiste) {
      return;
    }
    await Artiste.update(
      { nom, description, influences, style, confirmation, photoId },
      { where: { id } }
    );
    return artiste;
  } catch (error) {
    throw new Error(error.message);
  }
};
const DeleteOne = async (id) => {
  try {
    const artiste = await Artiste.findByPk(id);
    if (!artiste) {
      return;
    }
    await artiste.destroy();
    return `L'artiste a été retiré de la base de données`;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const ArtisteDAO = {
  Create,
  Confirm,
  ReadAll,
  ReadConfirmedArtistes,
  ReadUnconfirmedArtistes,
  ReadById,
  ReadByUserId,
  ReadByArtisteNom,
  UpdateOne,
  DeleteOne,
};
