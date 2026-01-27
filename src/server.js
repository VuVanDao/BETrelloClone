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
import cookieParser from "cookie-parser";
import { AccountModel } from "./models/AccountModel.js";

const app = express();

app.use("/health", (req, res) => {
  console.log("Ping Render");

  res.status(200).json({
    status: "ok",
    time: new Date().toISOString(),
  });
});
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(urlVersioning("v1"));
app.use(RateLimitReq);
app.set("trust proxy", 1);
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
app.use(cookieParser()); // giúp đọc cookie từ request
app.use(
  "/v1/api",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  API_Router,
);

app.use(errorHandling);

const startServer = async () => {
  console.log("Connecting to mongoDB");
  await connectMongoDB();
  await createIndexes();
  if (process.env.BUILD_MODE === "production") {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } else {
    app.listen(environmentConfig.LOCAL_PORT, () => {
      console.log(
        `Server is running on port http://localhost:${environmentConfig.LOCAL_PORT} ${environmentConfig.BUILD_MODE}`,
      );
    });
  }
};
const createIndexes = async () => {
  await AccountModel.createIndexes();
};
startServer();
