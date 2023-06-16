import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";
import Photo from "./Photo.js";

const Boisson = sequelize.define(
  "boisson",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    famille: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
    recette: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    saveurs: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
  }
);
export default Boisson;
