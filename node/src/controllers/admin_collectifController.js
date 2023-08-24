import { isAdmin } from "../utils/adminUtils.js";
import { Admin_CollectifDAO } from "../DAOs/admin_collectifDAO.js";
import { UserDAO } from "../DAOs/userDAO.js";
import { ArtisteDAO } from "../DAOs/artisteDAO.js";
import { CollectifDAO } from "../DAOs/collectifDAO.js";

const createAdmin_collectif = async (req, res) => {
  let result = null;
  let confirmation = false;
  try {
    const userId = parseInt(req.params.id);
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

    const { collectifId } = req.body;
    const existingCollectif = await CollectifDAO.ReadById(collectifId);
    if (!existingCollectif) {
      return res
        .status(404)
        .json({ message: `Collectif introuvable ou inexistant` });
    }
    if (!existingCollectif.confirmation) {
      return res.status(401).json({
        message: `Le collectif doit être validé avant d'accepter des membres`,
      });
    }
    result = await Admin_CollectifDAO.Create(confirmation, userId, collectifId);
    if (user.roleId >= 3) {
      return res.status(201).json({
        message: `Admin_collectif créé avec succès`,
        data: result,
      });
    }
    const changeRoleId = await UserDAO.UpdateRoleId(userId, 3);
    return res.status(201).json({
      message: `Admin_collectif créé avec succès`,
      data: result,
      changeRoleId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const confirmAdminCol = async (req, res) => {
  let result = null;
  try {
    const id = parseInt(req.params.id);
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (!admin || admin <= 4) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
    }
    const adminCol = await Admin_CollectifDAO.ReadById(id);
    if (!adminCol || adminCol.length === 0) {
      return res
        .status(404)
        .json({ message: `Admin du collectif introuvable ou inexistant` });
    }
    let confirmation = !adminCol.confirmation;
    result = await Admin_CollectifDAO.Confirm(id, confirmation);
    return res
      .status(200)
      .json({ message: `Admin confirmé avec succès`, data: result });
  } catch (error) {
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readAllAdmins = async (req, res) => {
  let result = null;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin) {
    return res.status(401).json({
      message: `Veuillez vous identifier ou vous inscrire pour accéder à ces informations`,
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
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readUnconfirmedAdmins = async (req, res) => {
  let result = null;
  try {
    result = await Admin_CollectifDAO.ReadUnconfirmedAdmins();
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: `Admin introuvable ou inexistant` });
    }
    return res.status(200).json({
      message: `Liste des admins non confirmés récupérée avec succès`,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readAdminByUserId = async (req, res) => {
  let result = null;
  const userId = parseInt(req.params.id);
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin) {
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
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const readByCollectifId = async (req, res) => {
  let result = null;
  const collectifId = parseInt(req.params.id);
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
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};

const deleteOne = async (req, res) => {
  let result = null;
  const id = parseInt(req.params.id);
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
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};
export const Admin_CollectifController = {
  createAdmin_collectif,
  confirmAdminCol,
  readAllAdmins,
  readUnconfirmedAdmins,
  readAdminByUserId,
  readByCollectifId,
  deleteOne,
};
