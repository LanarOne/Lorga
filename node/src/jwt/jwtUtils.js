import jwt from "jsonwebtoken";
import { secret } from "./jwtConfig.js";
const jwtOptions = {
  expiresIn: 28800000,
};

export const jwtVerify = async (token) => {
  console.log(token);
  try {
    const decoded = jwt.verify(token, secret);
    console.log(decoded);
    const userId = decoded.data;
    console.log(userId);
    return userId ? userId : "";
  } catch (error) {
    console.error(`jwtVerify Error`, error.message);
    return null;
  }
};

export const jwtSign = (data) => jwt.sign({ data }, secret, jwtOptions);
