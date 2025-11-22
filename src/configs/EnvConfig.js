import "dotenv/config";
export const environmentConfig = {
  LOCAL_PORT: process.env.LOCAL_PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  BUILD_MODE: process.env.BUILD_MODE,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_CLOUD_URL: process.env.REDIS_CLOUD_URL,
  LOCAL_URL: process.env.LOCAL_URL,
  DOMAIN_AUTH0: process.env.DOMAIN_AUTH0,
  RENDER_URL: process.env.RENDER_URL,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
};
