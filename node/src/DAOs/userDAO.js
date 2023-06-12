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
  try {
    const user = await User.findOne({
      where: { email: email },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (err) {
    console.error(err.message);
    return err;
  }
};

const ReadAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (err) {
    console.error(err.message);
    return err;
  }
};

const ReadUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    return Error(error.message);
  }
};

const UpdateUser = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    const { email, password, username, zipCode } = data;
    if (!user) {
      return null;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update(
      { email, password: hashedPassword, username, zipCode },
      { where: { id } }
    );
    return user;
  } catch (error) {
    console.error(error.message);
    return Error(error.message);
  }
};

const UpdateRoleId = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    const roleId = data;
    if (!user) {
      return null;
    }
    await User.update({ roleId }, { where: { id } });
    user.roleId = roleId;
    return user;
  } catch (error) {
    return Error(error.message);
  }
};
const DeleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    user.destroy();
    return `Utilisateur supprimé de la base de donnée`;
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
