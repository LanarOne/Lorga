import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";

const Photo = sequelize.define("photo", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alt: {
    type: DataTypes.TEXT("medium"),
    allowNull: false,
  },
});
export default Photo;
