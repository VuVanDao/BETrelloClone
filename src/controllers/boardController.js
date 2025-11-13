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
const getBoardDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await boardService.getBoardDetail(id);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Find board complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
export const boardController = {
  createNew,
  getBoardDetail,
};
