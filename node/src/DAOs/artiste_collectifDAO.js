import Artiste_Collectif from "../models/Artiste_Collectif.js";
async function Create(confirmation, artisteId, collectifId) {
  let result = null;
  try {
    result = Artiste_Collectif.create({ confirmation, artisteId, collectifId });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

async function Confirm(id, confirmation) {
  let result = null;
  try {
    const art_col = await Artiste_Collectif.findByPk(id);
    if (!art_col || art_col.length === 0) {
      return result;
    }
    result = await Artiste_Collectif.update(
      { confirmation },
      { where: { id } }
    );
    return result;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

async function ReadAll() {
  let result = null;
  let confirmation = true;
  try {
    result = await Artiste_Collectif.findAll({ where: { confirmation } });
    return result.map((art_col) => {
      return {
        confirmation: art_col.confirmation,
        collectifId: art_col.collectifId,
        artisteId: art_col.artisteId,
      };
    });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

const ReadUnconfirmedArtCol = async () => {
  let result = null;
  let confirmation = false;
  try {
    result = await Artiste_Collectif.findAll({ where: { confirmation } });
    return result.map((art_col) => {
      return {
        confirmation: art_col.confirmation,
        collectifId: art_col.collectifId,
        artisteId: art_col.artisteId,
      };
    });
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
};

async function ReadById(id) {
  let result = null;
  try {
    result = await Artiste_Collectif.findByPk(id);
    return {
      confirmation: result.confirmation,
      collectifId: result.collectifId,
      artisteId: result.artisteId,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

async function ReadByArtisteId(artisteId) {
  let result = null;
  let confirmation = true;
  try {
    result = await Artiste_Collectif.findAll({
      where: { artisteId, confirmation },
    });
    return result.map((art_col) => {
      return {
        confirmation: result.confirmation,
        collectifId: art_col.collectifId,
        artisteId: art_col.artisteId,
      };
    });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

async function ReadByCollectifId(collectifId) {
  let result = null;
  let confirmation = true;
  try {
    result = await Artiste_Collectif.findAll({
      where: { collectifId, confirmation },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
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
    throw new Error(error.message);
  }
}
export const Artiste_CollectifDAO = {
  Create,
  Confirm,
  ReadAll,
  ReadUnconfirmedArtCol,
  ReadById,
  ReadByArtisteId,
  ReadByCollectifId,
  DeleteOne,
};
