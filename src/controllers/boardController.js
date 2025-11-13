import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { boardService } from "../services/boardService.js";

const createNew = async (req, res, next) => {
  try {
    const result = await boardService.createNew(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Created board complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
const findOneByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing id", data: null });
    }
    const result = await boardService.findOneByID(id);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Find board complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
export const boardController = {
  createNew,
  findOneByID,
};
