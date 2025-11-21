import { StatusCodes } from "http-status-codes";
import { accountService } from "../services/accountService.js";
import ApiError from "../utils/ApiError.js";

const createNew = async (req, res, next) => {
  try {
    const result = await accountService.createNew(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Created user complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
export const accountController = {
  createNew,
};
