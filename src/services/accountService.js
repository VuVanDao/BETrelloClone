import { StatusCodes } from "http-status-codes";

import { AccountModel } from "../models/AccountModel.js";
import ApiError from "../utils/ApiError.js";

const createNew = async (data) => {
  try {
    if (!data) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to create");
    }
    let checkExist = await AccountModel.findOneByAuth0IdOrEmail(data.auth0Id);
    if (checkExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Account existed");
    }
    let res = await AccountModel.createNew(data);
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
    let res = await AccountModel.UpdateAccount(id);
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
    return checkEmailExist || checkAuth0Exist;
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
};
