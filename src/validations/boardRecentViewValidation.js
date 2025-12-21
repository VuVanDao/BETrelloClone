import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { OBJECTID_REGEX } from "../utils/constant.js";
const createNew = async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      accountId: Joi.string().pattern(OBJECTID_REGEX).required(),
      boardId: Joi.string().pattern(OBJECTID_REGEX).required(),
    });
    await correctCondition.validateAsync(req.body, {
      abortEarly: "false",
      allowUnknown: true,
    });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
  }
};
// const updateColumn = async (req, res, next) => {
//   try {
//     const correctCondition = Joi.object({
//       columnOrderIds: Joi.array()
//         .items(Joi.string().pattern(OBJECTID_REGEX))
//         .default([]),
//     });
//     await correctCondition.validateAsync(req.body, {
//       abortEarly: "false",
//     });
//     next();
//   } catch (error) {
//     next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
//   }
// };

export const boardRecentViewValidation = {
  createNew,
  //   updateColumn,
};
