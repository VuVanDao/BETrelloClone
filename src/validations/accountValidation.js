import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { ROLE } from "../utils/constant.js";

const createNew = async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      email: Joi.string().email().required().trim().strict(),
      username: Joi.string().required().trim().strict(),
      role: Joi.string().valid(...Object.values(ROLE)),
      auth0Id: Joi.string().optional().trim(),
      avatar: Joi.string().optional().trim(),
    });
    await correctCondition.validateAsync(req.body, {
      abortEarly: "false",
    });
    next();
  } catch (error) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      message: new Error(error).message,
    });
  }
};
export const accountValidation = {
  createNew,
};
