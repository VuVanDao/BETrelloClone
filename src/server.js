import express from "express";
import { environmentConfig } from "./configs/EnvConfig.js";
import { connectMongoDB } from "./configs/ConnectDB.js";
import { API_Router } from "./routes/index.js";
import { errorHandling } from "./middlewares/errorHandling.js";
import cors from "cors";
import { corsOptions } from "./configs/CorsConfig.js";
import { urlVersioning } from "./middlewares/ApiVersionConfig.js";
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(urlVersioning("v1"));
app.use("/v1/api", API_Router);
app.use(errorHandling);
const startServer = async () => {
  console.log("Connecting to mongoDB");
  await connectMongoDB();
  if (process.env.BUILD_MODE === "production") {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } else {
    app.listen(environmentConfig.LOCAL_PORT, () => {
      console.log(
        `Server is running on port http://localhost:${environmentConfig.LOCAL_PORT} ${environmentConfig.BUILD_MODE}`
      );
    });
  }
};
startServer();
