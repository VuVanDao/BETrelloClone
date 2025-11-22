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
export const accountService = {
  createNew,
};
