import { StatusCodes } from "http-status-codes";

import { AccountModel } from "../models/AccountModel.js";
import ApiError from "../utils/ApiError.js";

const createNew = async (data) => {
  try {
    if (!data) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to create");
    }
    let res = await AccountModel.createNew(data);
    // if (res && res?.insertedId) {
    //   res = await AccountModel.findOneByID(res?.insertedId);
    // }
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const accountService = {
  createNew,
};
