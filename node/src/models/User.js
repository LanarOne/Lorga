import { DataTypes } from "sequelize";
import { sequelize } from "../connection/connection.js";
import Role from "./Role.js";

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
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(50),
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
  },
  {
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
  }
);

Role.hasMany(User, {
  foreignKey: { allowNull: false, name: "roleId" },
  sourceKey: "id",
});

export default User;
