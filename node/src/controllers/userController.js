import bcrypt from "bcrypt";
import { emailIsValid } from "../utils/regexUtils.js";
import User from "../models/User.js";
import { UserDAO } from "../DAOs/userDAO.js";
import { jwtSign, jwtVerify } from "../jwt/jwtUtils.js";
import { stringIsFilled } from "../utils/stringUtils.js";
import { isAdmin } from "../utils/adminUtils.js";
import { generateConfirmationToken } from "../utils/generateConfirmationToken.js";
import sendEmail from "../services/emailService.js";

const signUp = async (req, res) => {
  try {
    const roleId = 1;
    const password = await bcrypt.hash(req.body.password, 10);
    let { email, username, zipCode, DOB } = req.body;
    email = decodeURIComponent(email);
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
    if (
      !stringIsFilled(email) ||
      !stringIsFilled(username) ||
      !stringIsFilled(password) ||
      !zipCode ||
      !DOB
    ) {
      return res
        .status(400)
        .json({ message: `Veuillez remplir tous les champs` });
    }
    const confirmationToken = generateConfirmationToken();
    const user = await UserDAO.Create(
      email,
      password,
      username,
      zipCode,
      DOB,
      confirmationToken,
      roleId
    );
    const confirmationLink = `http://localhost:3000/confirmationemail/${user.confirmationToken}`;
    const emailContent = `<h2>Bienvenue à Lorganiq!</h2>
<p>Confirme ton adresse mail en cliquant le lien ci-dessous :</p>
<a href="${confirmationLink}">Confirmation!</a>`;
    await sendEmail(user.email, "Confirme ton mail!", emailContent);
    return res.status(201).json({
      message: `utilisateur ${user.username} créé avec succès`,
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `erreur interne`, data: error });
  }
};
const signIn = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = decodeURIComponent(email);
    if (!stringIsFilled(email) || !stringIsFilled(password)) {
      return res
        .status(403)
        .json({ message: `Un champ obligatoire n'est pas renseigné` });
    }
    const user = await UserDAO.ReadUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        message: `Email ou mot de passe non valide`,
      });
    }
    if (!user.confirmation) {
      return res.status(401).json({
        message: `Valide ton compte en cliquant sur le lien reçu sur ${email}`,
      });
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
        data: user,
        token,
      });
    } else {
      return res.status(401).json({ message: `Impossible de se connecter` });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `erreur interne`, data: error });
  }
};

const emailConfirmation = async (req, res) => {
  try {
    const confirmationToken = req.params.confirmationToken;
    if (!confirmationToken) {
      return res.status(400).json({ message: `Token manquant` });
    }
    const confirm = await UserDAO.Confirm(confirmationToken);
    if (!confirm || confirm.length === 0) {
      return res.status(404).json({
        message: `Confirmation impossible, utilisateur ou token manquant`,
        data: confirm,
      });
    }
    return res
      .status(200)
      .json({ message: `Utilisateur confirmé avec succès`, data: confirm });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `Erreur interne`, data: error });
  }
};
const readAll = async (req, res) => {
  try {
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
      message: `Liste des utilisateurs récupérée avec succès`,
      data: users,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `erreur interne`, data: error });
  }
};
const readOne = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const admin = await isAdmin(token);

    if (!admin) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
    }
    const id = req.params.id;
    const user = await UserDAO.ReadUserById(id);
    if (!user || !user.confirmation) {
      return res
        .status(404)
        .json({ message: `Utilisateur introuvable ou inexistant` });
    }
    return res.status(200).json({
      message: `Utilisateur ${user.username} trouvé avec succès`,
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `erreur interne`, data: error });
  }
};
const getUser = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(403)
      .json({ message: `lacking authorization, please log-in` });
  }
  const id = await jwtVerify(token);
  const user = await UserDAO.ReadUserById(id);
  if (!user) {
    return res.status(404).json({ message: `cannot find user` });
  }
  return res
    .status(200)
    .json({ message: `user successfully retrieved`, data: user });
};
const updateOne = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const admin = await isAdmin(token);

    if (admin === 1) {
      return res
        .status(401)
        .json({ message: `Vous n'êtes pas autorisé à accéder à ces données` });
    }
    const id = req.params.id;
    let { email, password, username, zipCode } = req.body;
    email = decodeURIComponent(email);
    if (
      !stringIsFilled(email) ||
      !stringIsFilled(password) ||
      !stringIsFilled(username) ||
      !zipCode
    ) {
      return res
        .status(400)
        .json({ message: `Impossible de modifier les données` });
    }
    const data = { email, password, username, zipCode };
    const user = await UserDAO.UpdateUser(id, data);
    if (!user) {
      return res
        .status(404)
        .json({ message: `Utilisateur introuvable ou inexistant` });
    }
    return res.status(200).json({
      message: `Utilisateur ${user.username} mis à jour avec succès`,
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `erreur interne`, data: error });
  }
};

const updateRoleId = async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.headers.authorization;
    const admin = await isAdmin(token);
    if (!admin || admin <= 4) {
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
    const user = await UserDAO.UpdateRoleId(id, roleId);
    if (!user) {
      return res
        .status(404)
        .json({ message: `Utilisateur introuvable ou inexistant` });
    }
    return res.status(200).json({
      message: `Le role pour l'utilisateur ${user.username} a été mis à jour avec succès`,
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `erreur interne`, data: error });
  }
};
const deleteOne = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `erreur interne`, data: error });
  }
};
export const UserController = {
  signUp,
  signIn,
  emailConfirmation,
  readAll,
  readOne,
  getUser,
  updateOne,
  updateRoleId,
  deleteOne,
};
