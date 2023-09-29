import express from "express";
import { Connection, sequelize } from "./src/connection/connection.js";
import initMiddlewares from "./src/middlewares/init.js";
import { Sync } from "./src/connection/connection.js";
import initRoutes from "./src/routes/router.js";
import initializeRoles from "./src/utils/roles.js";
import { applyAssociation } from "./src/models/associations.js";

const app = express();
const PORT = process.env.PORT || 3333;

app.get("/", (req, res) => {
  res.send("ok");
});
const LaunchServer = async () => {
  try {
    await Connection();
    applyAssociation(sequelize);
    await Sync();
    initMiddlewares(app);
    initRoutes(app);

    app.listen(PORT, () => {
      console.log(`le serveur tourne sur le port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    return Error(error.message);
  }
};
LaunchServer()
  .then(() => {
    console.log(`Le serveur tourne`);
    initializeRoles().then(() => {
      console.log(`Les roles ont été créé`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
