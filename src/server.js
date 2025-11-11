import express from "express";
import { environmentConfig } from "./configs/EnvConfig.js";
import connectMongoDB from "./configs/ConnectDB.js";
import { API_Router } from "./routes/index.js";

const app = express();
app.use("/v1/api", API_Router);
const startServer = async () => {
  await connectMongoDB();
  app.listen(environmentConfig.port, () => {
    console.log(
      `Server is running on port http://localhost:${environmentConfig.port}`
    );
  });
};
startServer();
