import Joi from "joi";
import { StatusCodes } from "http-status-codes";
const createNew = async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      title: Joi.string().required().trim().strict().min(3).max(50),
      description: Joi.string().optional().trim().strict().min(3).max(250),
    });
    await correctCondition.validateAsync(req.body, {
      abortEarly: "false",
    });
    next();
  } catch (error) {
    console.log("🚀 ~ createNew ~ error:", error);
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      message: new Error(error).message,
    });
  }
};
export const cardValidation = {
  createNew,
};
