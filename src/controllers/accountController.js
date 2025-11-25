import { StatusCodes } from "http-status-codes";
import { accountService } from "../services/accountService.js";
import ApiError from "../utils/ApiError.js";
import { environmentConfig } from "../configs/EnvConfig.js";
import ms from "ms";
async function invalidateCache(req, input) {
  // const cacheKey = `accountId:${input}`;
  // await req.redisClient.del(cacheKey);
  const keys = await req.redisClient.keys(`accounts:*`);
  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
}
const createNew = async (req, res, next) => {
  try {
    const result = await accountService.createNew(req.body);
    await invalidateCache(req, "");
    await res
      .status(StatusCodes.CREATED)
      .json({ message: "Created user complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
const findOneByAuth0IdOrEmail = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      next(new ApiError(StatusCodes.BAD_REQUEST, "Missing id"));
    }
    const result = await accountService.findOneByAuth0IdOrEmail(id);
    const cacheKey = `accountId:${id}`;
    const cachedAccountDetail = await req.redisClient.get(cacheKey);
    if (cachedAccountDetail) {
      return res.status(StatusCodes.OK).json({
        message: `Get account with id ${id} successfully`,
        data: JSON.parse(cachedAccountDetail),
      });
    }
    // save your post in redis cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));
    res
      .status(StatusCodes.OK)
      .json({ message: "findOneById user complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};

const UpdateAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await accountService.UpdateAccount(id, req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: "Login complete", data: result });
  } catch (error) {
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, new Error(error).message)
    );
  }
};
const Login = async (req, res, next) => {
  try {
    const { email, auth0Id } = req.body;
    if (!email && !auth0Id) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Missing data to login");
    }
    const result = await accountService.Login(email, auth0Id);
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true, //JS không đọc được cookie
      secure: environmentConfig.BUILD_MODE, //Chỉ gửi qua HTTPS
      sameSite: "none",
      maxAge: ms("1 days"),
    });
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: environmentConfig.BUILD_MODE,
      sameSite: "none",
      maxAge: ms("1 days"),
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Login complete", data: result.data });
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, new Error(error).message));
  }
};
const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(StatusCodes.OK).json({ message: "Logout complete" });
  } catch (error) {
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, new Error(error).message)
    );
  }
};
const refreshToken = async (req, res, next) => {
  try {
    const result = await accountService.refreshToken(req.cookies.refreshToken);
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true, //JS không đọc được cookie
      secure: environmentConfig.BUILD_MODE, //Chỉ gửi qua HTTPS
      sameSite: "none",
      maxAge: ms("1 days"),
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Refresh token complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, new Error(error).message));
  }
};
const upload_avatar = async (req, res, next) => {
  try {
    const { accountId, public_id } = req.query;
    if (!req.file || !accountId) {
      return res.status(400).json({ error: "Không có file nào được upload" });
    }
    const result = await accountService.upload_avatar(
      req,
      accountId,
      public_id
    );

    res.status(StatusCodes.OK).json({
      message: "Upload thành công!",
      data: result,
    });
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, new Error(error).message));
  }
};
export const accountController = {
  createNew,
  findOneByAuth0IdOrEmail,
  Login,
  UpdateAccount,
  logout,
  refreshToken,
  upload_avatar,
};
