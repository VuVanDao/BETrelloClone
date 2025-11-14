import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { columnService } from "../services/columnService.js";

const createNew = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data");
    }
    const result = await columnService.createNew(req.body);
    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "create column not complete");
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "create column not complete", data: result });
  } catch (error) {
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, new Error(error).message)
    );
  }
};
export const columnController = {
  createNew,
};
