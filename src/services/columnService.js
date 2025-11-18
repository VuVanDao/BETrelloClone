import { StatusCodes } from "http-status-codes";
import { boardModel } from "../models/boardModel.js";
import { columnModel } from "../models/columnModel.js";
import ApiError from "../utils/ApiError.js";

const checkBoardIdExist = async (boardIds) => {
  try {
    return await boardModel.findOneByID(boardIds);
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (data) => {
  try {
    const checkBoard = await checkBoardIdExist(data.boardIds);
    if (!checkBoard) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Not found board of column");
    }
    const res = await columnModel.createNew(data);
    if (!res) return null;
    const result = await columnModel.findOneByID(res.insertedId);
    const AddColumnIdsToBoard = await boardModel.pushColumnToBoard(
      result._id,
      result.boardIds
    );
    if (!AddColumnIdsToBoard) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Cannot add column id to board"
      );
    }
    result.cards = [];
    result.FE_placeholder_card = true;
    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};
const updateCardOrderIds = async (data) => {
  try {
    const { columnId, cardOrderIds } = data;
    if (!columnId || !cardOrderIds) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to move card");
    }
    let res = await columnModel.updateCardOrderIds(columnId, cardOrderIds);
    if (!res || res.modifiedCount === 0 || res.matchedCount === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Cannot move card");
    }
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByID = async (columnId) => {
  try {
    if (!columnId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to find card");
    }
    let res = await columnModel.findOneByID(columnId);
    if (!res) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Card not found");
    }
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const columnService = {
  createNew,
  updateCardOrderIds,
  findOneByID,
};
