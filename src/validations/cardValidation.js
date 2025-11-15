import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { OBJECTID_REGEX } from "../utils/constant.js";
const createNew = async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      title: Joi.string().required().trim().strict().min(3).max(50),
      description: Joi.string().optional().trim().strict().min(3).max(250),
      boardIds: Joi.string().required().pattern(OBJECTID_REGEX),
      columnIds: Joi.string().required().pattern(OBJECTID_REGEX),
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
export const cardValidation = {
  createNew,
};
