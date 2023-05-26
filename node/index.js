import express from "express";
import { Connection } from "./src/connection/connection.js";
import { Sync } from "./src/connection/connection.js";

const app = express();
const PORT = process.env.PORT || 3333;

app.get("/", (req, res) => {
  res.send("ok");
});
await Connection();
Sync();

app.listen(PORT, () => {
  console.log(`le serveur tourne sur le port ${PORT}`);
});
