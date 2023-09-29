import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";
import Artiste from "./Artiste.js";
import Collectif from "./Collectif.js";

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

export default Lien;
