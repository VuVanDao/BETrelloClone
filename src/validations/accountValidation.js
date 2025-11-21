import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { ROLE } from "../utils/constant.js";

const createNew = async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      email: Joi.string().email().required().trim().strict(),
      authType: Joi.string()
        .valid("local", "google", "facebook")
        .default("local"),
      password: Joi.string()
        .trim()
        .strict()
        .when("authType", {
          is: "local",
          then: Joi.required(), // Nếu là local -> Bắt buộc
          otherwise: Joi.optional().allow(null, ""), // Nếu không -> Cho phép null hoặc rỗng
        }),
      username: Joi.string().required().trim().strict(),
      role: Joi.string()
        .valid(...Object.values(ROLE))
        .required(),
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
