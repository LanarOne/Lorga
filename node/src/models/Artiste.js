import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";
import User from "./User.js";
import Photo from "./Photo.js";
import Lien from "./Lien.js";

const Artiste = sequelize.define(
  "artiste",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
    influences: {
      type: DataTypes.STRING(150),
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
User.hasOne(Artiste, { foreignKey: { allowNull: false, name: "userId" } });
Photo.hasOne(Artiste, { foreignKey: { allowNull: false, name: "photoId" } });
export default Artiste;
