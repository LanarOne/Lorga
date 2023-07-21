import Admin_collectif from "../models/Admin_collectif.js";

const Create = async (confirmation, userId, collectifId) => {
  let result = null;
  try {
    result = Admin_collectif.create({ confirmation, userId, collectifId });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const Confirm = async (id, confirmation) => {
  let result = null;
  try {
    const admin_col = await Admin_collectif.findByPk(id);
    if (!admin_col || admin_col.length === 0) {
      return result;
    }
    result = await Admin_collectif.update({ confirmation }, { where: { id } });
    return result;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
};

const ReadAll = async () => {
  let result = null;
  try {
    result = await Admin_collectif.findAll();
    return result.map((adm_co) => {
      return { userId: adm_co.userId, collectifId: adm_co.collectifId };
    });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const ReadUnconfirmedAdmins = async () => {
  let result = null;
  let confirmation = false;
  try {
    result = await Admin_collectif.findAll({ where: { confirmation } });
    return result.map((adm_col) => {
      return {
        id: adm_col.id,
        confirmation: adm_col.confirmation,
        userId: adm_col.userId,
        collectifId: adm_col.collectifId,
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
    result = await Admin_collectif.findByPk(id);
    return { userId: result.userId, collectifId: result.collectifId };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const ReadByUserId = async (userId) => {
  let result = null;
  try {
    result = await Admin_collectif.findAll({ where: { userId } });
    if (!result || result.length === 0) {
      return;
    }
    return result.map((adm_co) => {
      return { userId: adm_co.userId, collectifId: adm_co.collectifId };
    });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const ReadByCollectifId = async (collectifId) => {
  let result = null;
  try {
    result = await Admin_collectif.findAll({ where: { collectifId } });
    if (!result || result.length === 0) {
      return;
    }
    return result.map((adm_co) => {
      if (adm_co.confirmation) {
        return { userId: adm_co.userId, collectifId: adm_co.collectifId };
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const DeleteOne = async (id) => {
  let result = null;
  try {
    const admin_collectif = await Admin_collectif.findByPk(id);
    if (!admin_collectif) {
      return result;
    }
    result = await admin_collectif.destroy();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
export const Admin_CollectifDAO = {
  Create,
  Confirm,
  ReadAll,
  ReadUnconfirmedAdmins,
  ReadById,
  ReadByUserId,
  ReadByCollectifId,
  DeleteOne,
};
