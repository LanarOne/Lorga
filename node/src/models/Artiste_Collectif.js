import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";

const Artiste_Collectif = sequelize.define(
  "artiste_collectif",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { timestamps: true, createdAt: "created", updatedAt: "updated" }
);
export default Artiste_Collectif;
