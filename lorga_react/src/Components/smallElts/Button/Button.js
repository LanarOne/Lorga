import React from "react";
import mc from "./button.module.scss";

const Button = ({ message, onClick }) => {
  return (
    <button className={`${mc.button}`} onClick={onClick}>
      {message}
    </button>
  );
};

export default Button;
