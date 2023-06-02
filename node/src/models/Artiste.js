import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";
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
Photo.hasOne(Artiste, {
  foreignKey: { allowNull: false, name: "photoId" },
  sourceKey: "id",
});
Artiste.hasMany(Lien, {
  foreignKey: { allowNull: true, name: "artisteId" },
  sourceKey: "id",
});

export default Artiste;
