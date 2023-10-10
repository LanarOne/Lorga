import { DataTypes } from "sequelize";
import { sequelize } from "../connection/connection.js";
import Role from "./Role.js";
import Booking from "./Booking.js";
import Collectif from "./Collectif.js";
import Admin_collectif from "./Admin_collectif.js";
import Artiste from "./Artiste.js";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        message: "email already registered",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DOB: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    confirmationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirmation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
  }
);

export default User;
