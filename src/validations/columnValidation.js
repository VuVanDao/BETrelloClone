import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { OBJECTID_REGEX } from "../utils/constant.js";
import ApiError from "../utils/ApiError.js";
const createNew = async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      title: Joi.string().required().trim().strict().min(3).max(50),
      boardIds: Joi.string().required().pattern(OBJECTID_REGEX),
    });
    await correctCondition.validateAsync(req.body, {
      abortEarly: "false",
    });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
  }
};
export const columnValidation = {
  createNew,
};
