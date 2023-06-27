import { isString } from "../utils/stringUtils.js";

const sanitize = (obj) => {
  const keys = Object.keys(obj);
  const sanitized = keys.reduce((toBuild, key) => {
    const value = obj[key];
    const escaped = isString(value) ? encodeURIComponent(value) : value;
    return { ...toBuild, [key]: escaped };
  }, {});
  return { ...sanitized };
};

export const sanitizeMiddleware = (req, res, next) => {
  req.body = sanitize(req.body);
  req.params = sanitize(req.params);
  next();
};
