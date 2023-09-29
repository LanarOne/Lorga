import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";

const Setlist = sequelize.define(
  "setlist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Setlist;
