import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/GenerateToken.js";
import { environmentConfig } from "../configs/EnvConfig.js";

const isAuthorized = async (req, res, next) => {
  try {
    const clientAccessToken = req.cookies.accessToken;
    if (!clientAccessToken) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, "Token not found"));
      return;
    }
    const accessTokenDecoded = await verifyToken(
      clientAccessToken,
      environmentConfig.ACCESS_TOKEN_SECRET_SIGNATURE
    );
    req.jwtDecoded = accessTokenDecoded;
    next();
  } catch (error) {
    if (error.message.includes("jwt expired")) {
      next(new ApiError(StatusCodes.GONE, "jwt expired"));
      return;
    }
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error from server"));
  }
};
export const AuthMiddleware = {
  isAuthorized,
};
