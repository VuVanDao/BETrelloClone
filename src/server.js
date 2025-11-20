import express from "express";
import cors from "cors";
import RateLimitReq from "./middlewares/RateLimitReq.js";
import helmet from "helmet";
import Redis from "ioredis";
import { environmentConfig } from "./configs/EnvConfig.js";
import { connectMongoDB } from "./configs/ConnectDB.js";
import { API_Router } from "./routes/index.js";
import { errorHandling } from "./middlewares/errorHandling.js";
import { corsOptions } from "./configs/CorsConfig.js";
import { urlVersioning } from "./middlewares/ApiVersionConfig.js";
const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(urlVersioning("v1"));
app.use(RateLimitReq);

// connect to redis client
const redisClient = new Redis(environmentConfig.REDIS_CLOUD_URL, {
  // Cấu hình tự động kết nối lại nếu rớt mạng (Rất quan trọng với Cloud)
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  console.log(`Req body ${req.body}`);
  next();
});
app.use(
  "/v1/api",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  API_Router
);
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
