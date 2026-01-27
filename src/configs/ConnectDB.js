import ApiError from "../utils/ApiError.js";
import { environmentConfig } from "./EnvConfig.js";
import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";
const uri =
  process.env.BUILD_MODE === "production"
    ? environmentConfig.MONGODB_PRODUCTION_URI
    : environmentConfig.MONGODB_URI;
let dbConnected = null;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export const connectMongoDB = async () => {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const database =
      process.env.BUILD_MODE === "production"
        ? environmentConfig.DATABASE_NAME_PRODUCTION
        : environmentConfig.DATABASE_NAME;
    dbConnected = client.db(database);
  } catch (err) {
    console.log("Cannot connect to mongoDB");
    console.log("🚀 ~ connectMongoDB ~ err:", err);
  }
  // finally {
  //   // Ensures that the client will close when you finish/error
  //   await client.close();
  // }
};
export const getDB = () => {
  if (!dbConnected) {
    throw new ApiError(500, "not connect to mongoDB");
  }
  return dbConnected;
};
