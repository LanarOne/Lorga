import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";
import Photo from "./Photo.js";

const Collectif = sequelize.define(
  "collectif",
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
    description: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
    influences: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    style: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
  }
);
Photo.hasOne(Collectif, { foreignKey: { allowNull: false, name: "photoId" } });
export default Collectif;
