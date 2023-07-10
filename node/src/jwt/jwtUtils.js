import jwt from "jsonwebtoken";
import { secret } from "./jwtConfig.js";
const jwtOptions = {
  expiresIn: 28800000,
};

export const jwtVerify = async (token) => {
  try {
    const decoded = jwt.verify(token, secret);
    const userId = decoded.data;
    return userId ? userId : "";
  } catch (error) {
    console.error(`jwtVerify Error`, error.message);
    return null;
  }
};

export const jwtSign = (data) => jwt.sign({ data }, secret, jwtOptions);
