import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";
import Collectif from "./Collectif.js";
import Artiste from "./Artiste.js";

const Lien = sequelize.define(
  "lien",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
  }
);
Collectif.hasMany(Lien, {
  foreignKey: { allowNull: true, name: "collectifId" },
});
Artiste.hasMany(Lien, { foreignKey: { allowNull: true, name: "artisteId" } });
export default Lien;
