import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";
import User from "./User.js";
import Collectif from "./Collectif.js";

const Booking = sequelize.define(
  "booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
  }
);
User.hasMany(Booking, { foreignKey: { allowNull: false, name: "userId" } });
Collectif.hasMany(Booking, {
  foreignKey: { allowNull: true, name: "collectifId" },
});
export default Booking;
