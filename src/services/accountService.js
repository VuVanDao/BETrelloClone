import { StatusCodes } from "http-status-codes";

import { AccountModel } from "../models/AccountModel.js";
import ApiError from "../utils/ApiError.js";

const createNew = async (data) => {
  try {
    if (!data) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to create");
    }
    let checkExist = await AccountModel.findOneByAuth0Id(data.auth0Id);
    if (checkExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Account existed");
    }
    let res = await AccountModel.createNew(data);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByAuth0Id = async (auth0Id) => {
  try {
    if (!auth0Id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing auth0Id to find");
    }
    let res = await AccountModel.findOneByAuth0Id(auth0Id);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const accountService = {
  createNew,
  findOneByAuth0Id,
};
