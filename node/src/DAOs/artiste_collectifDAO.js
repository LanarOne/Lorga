import Artiste_Collectif from "../models/Artiste_Collectif.js";
async function Create(artisteId, collectifId) {
  let result = null;
  try {
    result = Artiste_Collectif.create({ artisteId, collectifId });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function ReadAll() {
  let result = null;
  try {
    result = await Artiste_Collectif.findAll();
    return result.map((art_col) => {
      return { collectifId: art_col.collectifId, artisteId: art_col.artisteId };
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function ReadById(id) {
  let result = null;
  try {
    result = await Artiste_Collectif.findByPk(id);
    return { collectifId: result.collectifId, artisteId: result.artisteId };
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function ReadByArtisteId(artisteId) {
  let result = null;
  try {
    result = await Artiste_Collectif.findAll({ where: { artisteId } });
    return result.map((art_col) => {
      return { collectifId: art_col.collectifId, artisteId: art_col.artisteId };
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function ReadByCollectifId(collectifId) {
  let result = null;
  try {
    result = await Artiste_Collectif.findAll({ where: { collectifId } });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function DeleteOne(id) {
  let result = null;
  try {
    const artiste_collectif = await Artiste_Collectif.findByPk(id);
    if (!artiste_collectif) {
      return result;
    }
    result = await artiste_collectif.destroy();
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}
export const Artiste_CollectifDAO = {
  Create,
  ReadAll,
  ReadById,
  ReadByArtisteId,
  ReadByCollectifId,
  DeleteOne,
};
