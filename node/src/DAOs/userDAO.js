import User from "../models/User.js";
import bcrypt from "bcrypt";
import user from "../models/User.js";

const Create = async (
  email,
  password,
  username,
  zipCode,
  DOB,
  confirmationToken,
  roleId
) => {
  let result = null;
  try {
    result = User.create({
      email,
      password,
      username,
      zipCode,
      DOB,
      confirmationToken,
      roleId,
    });
    return result;
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};

const Confirm = async (confirmationToken) => {
  let result;
  try {
    const confirmation = true;
    result = await User.findOne({
      where: { confirmationToken: confirmationToken },
    });
    if (!result || result.length === 0) {
      return result;
    }
    const user = await User.update(
      { confirmation },
      { where: { confirmationToken: confirmationToken } }
    );
    return result, user;
  } catch (error) {
    console.error(error.message);
    throw new Error(error);
  }
};
const ReadUserByEmail = async (email) => {
  let result = null;
  try {
    let confirmation = true;
    result = await User.findOne({
      where: { email: email, confirmation: confirmation },
    });
    if (!result) {
      return result;
    }
    return {
      id: result.id,
      email: result.email,
      password: result.password,
      username: decodeURIComponent(result.username),
      confirmation: result.confirmation,
    };
  } catch (err) {
    console.error(err.message);
    return err;
  }
};

const ReadAllUsers = async () => {
  let result = null;
  try {
    result = await User.findAll();
    return result.map((user) => {
      return {
        email: user.email,
        username: decodeURIComponent(user.username),
        zipcode: user.zipCode,
        roleId: user.roleId,
      };
    });
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
    return {
      id: result.id,
      email: result.email,
      username: decodeURIComponent(result.username),
      zipcode: result.zipCode,
      confirmation: result.confirmation,
      roleId: result.roleId,
    };
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
  Confirm,
  ReadUserById,
  ReadAllUsers,
  ReadUserByEmail,
  UpdateUser,
  UpdateRoleId,
  DeleteUser,
};
