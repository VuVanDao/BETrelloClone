import { StatusCodes } from "http-status-codes";
import { environmentConfig } from "../configs/EnvConfig.js";

export const errorHandling = (err, req, res, next) => {
  if (!err.statusCode) {
    err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack,
  };
  if (environmentConfig.BUILD_MODE === "production") {
    delete responseError["stack"];
  }
  res.status(responseError.statusCode).json(responseError);
};
