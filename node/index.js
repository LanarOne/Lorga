import express from "express";
import { Connection } from "./src/connection/connection.js";
import initMiddlewares from "./src/middlewares/init.js";
import { Sync } from "./src/connection/connection.js";
import initRoutes from "./src/routes/router.js";

const app = express();
const PORT = process.env.PORT || 3333;

app.get("/", (req, res) => {
  res.send("ok");
});
const LaunchServer = async () => {
  try {
    await Connection();
    await Sync();
    initMiddlewares(app);
    initRoutes(app);

    app.listen(PORT, () => {
      console.log(`le serveur tourne sur le port ${PORT}`);
    });
  } catch (error) {
    return Error(error.message);
  }
};
LaunchServer()
  .then(() => {
    console.log(`Le serveur tourne`);
  })
  .catch((error) => {
    console.error(error);
  });
