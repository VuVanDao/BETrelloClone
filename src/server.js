import express from "express";
import { environmentConfig } from "./configs/EnvConfig.js";
import connectMongoDB from "./configs/ConnectDB.js";
import { API_Router } from "./routes/index.js";
import { errorHandling } from "./middlewares/errorHandling.js";

const app = express();
app.use(express.json());

app.use("/v1/api", API_Router);
app.use(errorHandling);
const startServer = async () => {
  await connectMongoDB();
  app.listen(environmentConfig.port, () => {
    console.log(
      `Server is running on port http://localhost:${environmentConfig.port}`
    );
  });
};
startServer();
