import Lien from "../models/Lien.js";

const Create = async (url, artisteId, collectifId) => {
  let result = null;
  try {
    result = await Lien.create({ url, artisteId, collectifId });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const ReadAll = async () => {
  let result = null;
  try {
    result = await Lien.findAll();
    if (!result || result.length === 0)
      return result.map((lien) => {
        return {
          url: decodeURIComponent(lien.url),
          artisteId: lien.artisteId,
          collectifId: lien.collectifId,
        };
      });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const ReadById = async (id) => {
  let result = null;
  try {
    result = await Lien.findByPk(id);
    return {
      url: decodeURIComponent(result.url),
      artisteId: result.artisteId,
      collectifId: result.collectifId,
    };
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const ReadByArtisteId = async function lienById(artisteId) {
  let result = null;
  try {
    result = await Lien.findAll({ where: { artisteId } });
    return result.map((lien) => {
      return {
        url: decodeURIComponent(lien.url),
        artisteId: lien.artisteId,
        collectifId: lien.collectifId,
      };
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const ReadByCollectifId = async function lienByCoId(collectifId) {
  let result = null;
  try {
    result = await Lien.findAll({ where: { collectifId } });
    return result.map((lien) => {
      return {
        url: decodeURIComponent(lien.url),
        artisteId: lien.artisteId,
        collectifId: lien.collectifId,
      };
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const UpdateOne = async (id, data) => {
  let result = null;
  try {
    result = await Lien.findByPk(id);
    const { url, artisteId, collectifId } = data;
    await Lien.update({ url, artisteId, collectifId }, { where: { id } });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const DeleteOne = async (id) => {
  let result = null;
  let message = `Le lien a été effacé de la base de données avec succès`;
  try {
    result = await Lien.findByPk(id);
    await result.destroy();
    return message;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

export const LienDAO = {
  Create,
  ReadAll,
  ReadById,
  ReadByArtisteId,
  ReadByCollectifId,
  UpdateOne,
  DeleteOne,
};
