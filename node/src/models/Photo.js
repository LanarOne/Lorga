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
  photoDatas: {
    type: DataTypes.BLOB,
    allowNull: false,
  },
  alt: {
    type: DataTypes.TEXT(300),
    allowNull: false,
  },
});
export default Photo;
