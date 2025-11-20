import "dotenv/config";
export const environmentConfig = {
  LOCAL_PORT: process.env.LOCAL_PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  BUILD_MODE: process.env.BUILD_MODE,
  REDIS_URL: process.env.REDIS_URL,
};
