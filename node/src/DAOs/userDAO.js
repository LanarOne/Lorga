import User from "../models/User.js";
import bcrypt from "bcrypt";

const Create = async (email, password, username, zipCode, roleId) => {
  let result = null;
  try {
    result = User.create({ email, password, username, zipCode, roleId });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};
const ReadUserByEmail = async (email) => {
  let result = null;
  try {
    result = await User.findOne({
      where: { email: email },
    });
    if (!result) {
      return;
    }
    return result;
  } catch (err) {
    console.error(err.message);
    return err;
  }
};

const ReadAllUsers = async () => {
  let result = null;
  try {
    result = await User.findAll();
    return result;
  } catch (err) {
    console.error(err.message);
    return err;
  }
};

const ReadUserById = async (id) => {
  let result = null;
  try {
    result = await User.findByPk(id);
    if (!result) {
      return;
    }
    return result;
  } catch (error) {
    return Error(error.message);
  }
};

const UpdateUser = async (id, data) => {
  let result = null;
  try {
    const user = await User.findByPk(id);
    const { email, password, username, zipCode } = data;
    if (!user) {
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    result = await user.update({
      email,
      password: hashedPassword,
      username,
      zipCode,
    });
    return result;
  } catch (error) {
    console.error(error.message);
    return Error(error.message);
  }
};

const UpdateRoleId = async (id, data) => {
  let result = null;
  try {
    result = await User.findByPk(id);
    const roleId = data;
    if (!result) {
      return;
    }
    await User.update({ roleId }, { where: { id } });
    result.roleId = roleId;
    return result;
  } catch (error) {
    return Error(error.message);
  }
};
const DeleteUser = async (id) => {
  let result = null;
  let message = `Utilisateur supprimé de la base de donnée`;
  try {
    result = await User.findByPk(id);
    if (!result) {
      return;
    }
    result.destroy();
    return message;
  } catch (err) {
    console.error(err.message);
    return err;
  }
};
export const UserDAO = {
  Create,
  ReadUserById,
  ReadAllUsers,
  ReadUserByEmail,
  UpdateUser,
  UpdateRoleId,
  DeleteUser,
};
