import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";
import Photo from "./Photo.js";
import Lien from "./Lien.js";
import Artiste from "./Artiste.js";
import Artiste_Collectif from "./Artiste_Collectif.js";

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
Photo.hasOne(Collectif, {
  foreignKey: { allowNull: false, name: "photoId", unique: true },
  sourceKey: "id",
});
Collectif.hasMany(Lien, {
  foreignKey: { allowNull: true, name: "collectifId" },
  sourceKey: "id",
});
Collectif.belongsToMany(Artiste, { through: Artiste_Collectif });
export default Collectif;
