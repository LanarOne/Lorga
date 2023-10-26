import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";

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
      unique: true,
    },
  },
  {
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
  }
);

export default Lien;
