import { DataTypes } from "sequelize";
import { sequelize } from "../connection/connection.js";

const Role = sequelize.define("role", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});
export default Role;
