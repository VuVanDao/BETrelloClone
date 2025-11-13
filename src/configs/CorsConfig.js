import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { whitelist } from "../utils/constant.js";
import { environmentConfig } from "./EnvConfig.js";

export const corsOptions = {
  origin: function (origin, callback) {
    // console.log("🚀 ~ origin:", origin);
    if (!origin && environmentConfig.BUILD_MODE === "dev") {
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new ApiError(StatusCodes.FORBIDDEN, "Not allowed by CORS"));
    }
  },
};
