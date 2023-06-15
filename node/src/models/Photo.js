import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";
import Boisson from "./Boisson.js";

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

Photo.hasMany(Boisson, {
  foreignKey: { allowNull: false, name: "photoId" },
  sourceKey: "id",
});
export default Photo;
