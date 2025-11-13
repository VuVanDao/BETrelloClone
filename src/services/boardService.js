import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { ConvertStringToSlug } from "../utils/StringToSlug.js";
import { boardModel } from "../models/boardModel.js";
const createNew = async (data) => {
  try {
    if (!data) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to create");
    }
    const newBoard = {
      ...data,
      slug: ConvertStringToSlug(data.title),
    };
    let res = await boardModel.createNew(newBoard);
    if (res && res?.insertedId) {
      res = await boardModel.findOneByID(res?.insertedId);
    }
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByID = async (id) => {
  try {
    const res = boardModel.findOneByID(id);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const boardService = {
  createNew,
  findOneByID,
};
