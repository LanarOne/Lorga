import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";
import User from "./User.js";
import Collectif from "./Collectif.js";

const Admin_collectif = sequelize.define(
  "admin-collectif",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { timestamps: true, createdAt: "created", updatedAt: "updated" }
);

export default Admin_collectif;
