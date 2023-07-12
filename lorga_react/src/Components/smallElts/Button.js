import React from "react";
import mc from "./button.module.scss";

const Button = ({ message }) => {
  return <button className={`${mc.button}`}>{message}</button>;
};

export default Button;
