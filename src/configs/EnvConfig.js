import "dotenv/config";
export const environmentConfig = {
  port: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  BUILD_MODE: process.env.BUILD_MODE,
};
