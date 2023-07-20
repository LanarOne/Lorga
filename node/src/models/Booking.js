import { sequelize } from "../connection/connection.js";
import { DataTypes } from "sequelize";
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
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nbr_invite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    confirmation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
  }
);
Collectif.hasMany(Booking, {
  foreignKey: { allowNull: true, name: "collectifId" },
  sourceKey: "id",
});
export default Booking;
