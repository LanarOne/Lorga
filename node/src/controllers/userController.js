import bcrypt from "bcrypt";
import { emailIsValid } from "../utils/regexUtils.js";
import User from "../models/User.js";
import { UserDAO } from "../DAOs/userDAO.js";
import { jwtSign } from "../jwt/jwtUtils.js";
import { stringIsFilled } from "../utils/stringUtils.js";
import { isAdmin } from "../utils/adminUtils.js";
const signUp = async (req, res) => {
  try {
    const roleId = 1;
    const password = await bcrypt.hash(req.body.password, 10);
    const { email, username, zipCode } = req.body;
    if (!emailIsValid(email)) {
      return res
        .status(400)
        .json({ message: `l'email n'est pas au bon format` });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: `un compte est déjà lié à cette adresse : ${email}` });
    }
    if (!email || !password || !username || !zipCode) {
      return res
        .status(400)
        .json({ message: `Veuillez remplir tous les champs` });
    }
    const user = await UserDAO.Create(
      email,
      password,
      username,
      zipCode,
      roleId
    );
    const id = user.id;
    const token = jwtSign(id);
    return res.status(201).json({
      message: `utilisateur ${user.username} créé avec succès`,
      data: user,
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `erreur interne`, data: error });
  }
};
const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!stringIsFilled(email) || !stringIsFilled(password)) {
    return res
      .status(403)
      .json({ message: `Un champ obligatoire n'est pas renseigné` });
  }
  const user = await UserDAO.ReadUserByEmail(email);
  if (!user) {
    return res
      .status(404)
      .json({ message: `L'utilisateur n'existe pas dans la base de données` });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ message: `Email ou mot de passe non valide` });
  }
  if (user && isPasswordValid) {
    const token = jwtSign(user.id);
    return res.status(201).json({
      message: `Utilisateur ${user.username} connecté avec succès`,
      data: user.email,
      token,
    });
  } else {
    return res.status(401).json({ message: `Impossible de se connecter` });
  }
};
const readAll = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  const users = await UserDAO.ReadAllUsers();
  if (!users) {
    return res
      .status(404)
      .json({ message: `Aucun utilisateur n'a été trouvé` });
  }
  return res.status(200).json({
    message: `Liste des utilisateurs récupéré avec succès`,
    data: users,
  });
};
const readOne = async (req, res) => {
  const token = req.headers.authorization;
  const admin = await isAdmin(token);

  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
  }
  const id = req.params.id;
  const user = await UserDAO.ReadUserById(id);
  if (!user) {
    return res
      .status(404)
      .json({ message: `Utilisateur introuvable ou inexistant` });
  }
  return res.status(200).json({
    message: `Utilisateur ${user.username} trouvé avec succès`,
    data: user,
  });
};
const updateOne = async (req, res) => {
  const id = req.params.id;
  const { email, password, username, zipCode } = req.body;
  if (!email || !password || !username || !zipCode) {
    return res
      .status(400)
      .json({ message: `Impossible de modifier les données` });
  }
  const data = { email, password, username, zipCode };
  const user = await UserDAO.UpdateUser(id, data);
  if (!user) {
    return res.status(404).json({ message: `Utilisateur introuvable` });
  }
  return res.status(200).json({
    message: `Utilisateur ${user.username} mis à jour avec succès`,
    data: user,
  });
};

const updateRoleId = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (!admin || admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  const { roleId } = req.body;
  if (!roleId) {
    return res
      .status(400)
      .json({ message: `Impossible de modifier les données` });
  }
  const data = roleId;
  const user = await UserDAO.UpdateRoleId(id, data);
  if (!user) {
    return res.status(404).json({ message: `Utilisateur introuvable` });
  }
  return res.status(200).json({
    message: `Le role pour l'utilisateur ${user.username} a été mis à jour avec succès`,
    data: user,
  });
};
const deleteOne = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization;
  const admin = await isAdmin(token);
  if (admin === 1) {
    return res
      .status(401)
      .json({ message: `Vous n'êtes pas autorisé à modifier ces données` });
  }
  const user = await UserDAO.DeleteUser(id);
  if (!user) {
    return res
      .status(404)
      .json({ message: `Utilisateur introuvable ou inexistant` });
  } else {
    return res.status(200).json({
      message: `L'utilisateur a été supprimé de la base de données avec succès`,
    });
  }
};
export const UserController = {
  signUp,
  signIn,
  readAll,
  readOne,
  updateOne,
  updateRoleId,
  deleteOne,
};
