import { jwtVerify } from "./jwtUtils.js";

export const jwtMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    console.log(`middleware`);
    return res.status(403).json({ message: `no header found` });
  }
  const userId = await jwtVerify(token);
  if (!userId)
    return res
      .status(403)
      .json({ message: `Adresse mail ou mot de passe incorrect` });
  req.body = { ...req.body, userId };
  next();
};
