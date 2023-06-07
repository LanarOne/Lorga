import jwt from "jsonwebtoken";
import { UserDAO } from "../daos/userDao.js";
import { secret } from "../jwt/jwtConfig.js";

export const isAdmin = async (token) => {
  if (!token) {
    return;
  }
  const decoded = jwt.verify(token, secret);
  const userId = decoded.data;
  const user = await UserDAO.ReadUserById(userId);
  return user.roleId;
};
