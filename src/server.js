import express from "express";
import { environmentConfig } from "./configs/EnvConfig.js";
import connectMongoDB from "./configs/ConnectDB.js";

const app = express();
const startServer = async () => {
  await connectMongoDB();
  app.listen(environmentConfig.port, () => {
    console.log(`Server is running on port ${environmentConfig.port}`);
  });
};
startServer();
