import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { boardService } from "../services/boardService.js";

const createNew = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing title" });
    }
    const result = await boardService.createNew({ title, description });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "redirect to boardService", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
export const boardController = {
  createNew,
};
