import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
const createNew = async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      title: Joi.string().required().trim().strict().min(3).max(50),
      description: Joi.string().optional().trim().strict().min(3).max(250),
      type: Joi.string().valid("public", "private", "protected").required(),
    });
    await correctCondition.validateAsync(req.body, {
      abortEarly: "false",
    });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};

export const boardValidation = {
  createNew,
};
