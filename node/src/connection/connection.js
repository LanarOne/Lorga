import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("lorga_project", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  logging: false,
});

export const Connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection established successfully");
  } catch (error) {
    throw new Error(error.message);
  }
};

export const Sync = async () => {
  try {
    await sequelize.sync();
    console.log("Sync successful");
  } catch (error) {
    throw new Error(error.message);
  }
};
export default { sequelize };
