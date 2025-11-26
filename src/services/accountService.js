import { StatusCodes } from "http-status-codes";
import { AccountModel } from "../models/AccountModel.js";
import ApiError from "../utils/ApiError.js";
import { generateToken, verifyToken } from "../utils/GenerateToken.js";
import { environmentConfig } from "../configs/EnvConfig.js";
import { CloudinaryHelper } from "../Helper/CloudinaryHelper.js";

const createNew = async (data) => {
  try {
    if (!data) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to create");
    }
    let res;
    let checkExist = await AccountModel.findOneByAuth0IdOrEmail(data.auth0Id);
    if (checkExist) {
      res = await AccountModel.UpdateAccount(checkExist?._id, {
        auth0Id: data?.auth0Id,
        email: data?.email,
      });
      res = await AccountModel.findOneById(res?._id);
    } else {
      res = await AccountModel.createNew(data);
      res = await AccountModel.findOneById(res?.insertedId);
    }

    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByAuth0IdOrEmail = async (id) => {
  try {
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing id to find");
    }
    let res = await AccountModel.findOneByAuth0IdOrEmail(id);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const UpdateAccount = async (id, data) => {
  try {
    if (!id || !data) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to update");
    }
    let res = await AccountModel.UpdateAccount(id, data);
    if (res.modifiedCount === 0 || res.matchedCount === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Update failed");
    }
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing id to find");
    }
    let res = await AccountModel.findOneById(id);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const Login = async (email, auth0Id) => {
  try {
    const checkAccountExist = await accountService.findOneByAuth0IdOrEmail(
      email || auth0Id
    );
    if (!checkAccountExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Account is not exist");
    }
    if (
      checkAccountExist &&
      checkAccountExist.email === email &&
      checkAccountExist.auth0Id !== auth0Id
    ) {
      const res = await AccountModel.UpdateAccount(checkAccountExist?._id, {
        auth0Id: auth0Id,
      });
      if (res.modifiedCount === 0 || res.matchedCount === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Update failed");
      }
    }
    const accountInfo = {
      auth0Id: checkAccountExist.auth0Id,
      username: checkAccountExist.username,
      id: checkAccountExist._id,
    };
    const accessToken = await generateToken(
      accountInfo,
      environmentConfig.ACCESS_TOKEN_SECRET_SIGNATURE,
      environmentConfig.ACCESS_TOKEN_TIME_LIFE
      // 15
    );
    const refreshToken = await generateToken(
      accountInfo,
      environmentConfig.REFRESH_TOKEN_SECRET_SIGNATURE,
      environmentConfig.REFRESH_TOKEN_TIME_LIFE
    );
    return { data: checkAccountExist, refreshToken, accessToken };
  } catch (error) {
    throw new Error(error);
  }
};
const refreshToken = async (refreshTokenClient) => {
  try {
    const refreshTokenDecoded = await verifyToken(
      refreshTokenClient,
      environmentConfig.REFRESH_TOKEN_SECRET_SIGNATURE
    );
    const accountInfo = {
      auth0Id: refreshTokenDecoded.auth0Id,
      username: refreshTokenDecoded.username,
      id: refreshTokenDecoded.id,
    };
    const accessToken = await generateToken(
      accountInfo,
      environmentConfig.ACCESS_TOKEN_SECRET_SIGNATURE,
      environmentConfig.ACCESS_TOKEN_TIME_LIFE
      // 15
    );
    return { accessToken };
  } catch (error) {
    throw new Error(error);
  }
};
const upload_avatar = async (req, accountId, clientPublic_id) => {
  try {
    const { public_id, secure_url } = await CloudinaryHelper.uploadToCloudinary(
      req,
      clientPublic_id
    );
    const res = await AccountModel.UpdateAccount(accountId, {
      avatar: secure_url,
      public_id: public_id,
    });
    if (res.modifiedCount === 0 || res.matchedCount === 0) {
      throw new ApiError("update avatar not complete");
    }
    return { public_id, avatar: secure_url };
  } catch (error) {
    throw new Error(error);
  }
};

export const accountService = {
  createNew,
  findOneByAuth0IdOrEmail,
  Login,
  findOneById,
  UpdateAccount,
  refreshToken,
  upload_avatar,
};
