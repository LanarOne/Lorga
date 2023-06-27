export const isString = (data) => {
  return (
    typeof data === "string" ||
    data instanceof String ||
    Object.prototype.toString.call(data) === "[object String]"
  );
};
export const stringIsFilled = (data) => {
  return isString(data) && data.trim().length > 0;
};
