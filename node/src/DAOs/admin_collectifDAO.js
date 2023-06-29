import Admin_collectif from "../models/Admin_collectif.js";

async function Create(userId, collectifId) {
  let result = null;
  try {
    result = Admin_collectif.create({ userId, collectifId });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function ReadAll() {
  let result = null;
  try {
    result = await Admin_collectif.findAll();
    return result.map((adm_co) => {
      return { userId: adm_co.userId, collectifId: adm_co.collectifId };
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function ReadById(id) {
  let result = null;
  try {
    result = await Admin_collectif.findByPk(id);
    return { userId: result.userId, collectifId: result.collectifId };
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function ReadByUserId(userId) {
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
    return Error(error.message);
  }
}

async function ReadByCollectifId(collectifId) {
  let result = null;
  try {
    result = await Admin_collectif.findAll({ where: { collectifId } });
    if (!result || result.length === 0) {
      return;
    }
    return result.map((adm_co) => {
      return { userId: adm_co.userId, collectifId: adm_co.collectifId };
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function DeleteOne(id) {
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
    return Error(error.message);
  }
}
export const Admin_CollectifDAO = {
  Create,
  ReadAll,
  ReadById,
  ReadByUserId,
  ReadByCollectifId,
  DeleteOne,
};
