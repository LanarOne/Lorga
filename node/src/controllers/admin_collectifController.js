import { isAdmin } from "../utils/adminUtils.js";
import { Admin_CollectifDAO } from "../DAOs/admin_collectifDAO.js";
import { UserDAO } from "../DAOs/userDAO.js";
import { ArtisteDAO } from "../DAOs/artisteDAO.js";
import { CollectifDAO } from "../DAOs/collectifDAO.js";

async function createAdmin_collectif(req, res) {
  let result = null;
  const userId = req.params.id;
  const user = await UserDAO.ReadUserById(userId);
  if (!user) {
    return res
      .status(404)
      .json({ message: `Utilisateur introuvable ou inexistant` });
  }
  const artiste = await ArtisteDAO.ReadByUserId(userId);
  if (artiste) {
    return res
      .status(406)
      .json({ message: `Page artiste existante pour ce profil` });
  }
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: `Veuillez vous enregistrer` });
  }
  const admin = await isAdmin(token);
  if (!admin || admin <= 2) {
    return res
      .status(403)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  try {
    const { collectifId } = req.body;
    const existingCollectif = await CollectifDAO.ReadById(collectifId);
    if (!existingCollectif) {
      return res
        .status(404)
        .json({ message: `Collectif introuvable ou inexistant` });
    }
    result = await Admin_CollectifDAO.Create(userId, collectifId);
    if (user.roleId >= 3) {
      return res.status(201).json({
        message: `Admin_collectif créé avec succès`,
        data: result,
      });
    }
    const changeRoleId = UserDAO.UpdateRoleId(userId, 3);
    return res.status(201).json({
      message: `Admin_collectif créé avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function readAllAdmins(req, res) {
  let result = null;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res.status(401).json({
      message: `Veuillez vous identifiez ou vous inscrire pour accéder à ces informations`,
    });
  }
  try {
    result = await Admin_CollectifDAO.ReadAll();
    if (!result || result.length === 0) {
      return res.status(404).json({
        message: `Liste des admins introuvables ou inexistante`,
      });
    }
    return res.status(200).json({
      message: `Liste des admins récupérée avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function readAdminByUserId(req, res) {
  let result = null;
  const userId = req.params.id;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res.status(401).json({
      message: `Veuillez vous identifiez ou vous inscrire pour accéder à ces informations`,
    });
  }
  try {
    result = await Admin_CollectifDAO.ReadByUserId(userId);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Utilisateur introuvable ou inexistant` });
    }
    return res
      .status(200)
      .json({ message: `Admin trouvé avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function readByCollectifId(req, res) {
  let result = null;
  const collectifId = req.params.id;
  try {
    result = await Admin_CollectifDAO.ReadByCollectifId(collectifId);
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Liste du collectif introuvable ou inexistante` });
    }
    return res.status(200).json({
      message: `Liste des admins du collectif récupérée avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}

async function deleteOne(req, res) {
  let result = null;
  const id = req.params.id;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res.status(401).json({
      message: `Veuillez vous identifiez ou vous inscrire pour accéder à ces informations`,
    });
  }
  try {
    const existingAdmin = await Admin_CollectifDAO.ReadById(id);
    if (!existingAdmin) {
      return res
        .status(404)
        .json({ message: `Admins introuvable ou inexistant` });
    }
    let userId = existingAdmin.userId;
    result = await Admin_CollectifDAO.DeleteOne(id);
    const isStillAdmin = await Admin_CollectifDAO.ReadByUserId(userId);
    if (!isStillAdmin || isStillAdmin.length === 0) {
      const changeRoleId = await UserDAO.UpdateRoleId(userId, 1);
      result = await Admin_CollectifDAO.DeleteOne(id);
      return res.status(200).json({
        message: `Admin supprimé avec succès`,
        data: result,
        changeRoleId,
      });
    }
    return res
      .status(200)
      .json({ message: `Admin supprimé avec succès`, data: result });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
}
export const Admin_CollectifController = {
  createAdmin_collectif,
  readAllAdmins,
  readAdminByUserId,
  readByCollectifId,
  deleteOne,
};
