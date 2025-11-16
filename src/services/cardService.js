import { StatusCodes } from "http-status-codes";
import { boardModel } from "../models/boardModel.js";
import { cardModel } from "../models/cardModel.js";
import { columnModel } from "../models/columnModel.js";
import ApiError from "../utils/ApiError.js";

const checkBoardIdExist = async (boardIds) => {
  try {
    return await boardModel.findOneByID(boardIds);
  } catch (error) {
    throw new Error(error);
  }
};
const checkColumnIdExist = async (columnIds) => {
  try {
    return await columnModel.findOneByID(columnIds);
  } catch (error) {
    throw new Error(error);
  }
};
const createNew = async (data) => {
  try {
    const checkBoard = await checkBoardIdExist(data?.boardIds);
    if (!checkBoard) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Not found board of card");
    }
    const checkColumn = await checkColumnIdExist(data?.columnIds);
    if (!checkColumn) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Not found column of card");
    }
    const result = await cardModel.createNewCard(data);
    if (!result) {
      return null;
    }
    const res = await cardModel.findOneById(result.insertedId);
    const addCardToColumn = await columnModel.pushCardIdToColumn(
      res.columnIds,
      res._id
    );
    if (
      addCardToColumn.modifiedCount === 0 ||
      addCardToColumn.matchedCount === 0 ||
      !res
    ) {
      await cardModel.DeleteOneById(res._id);
      return null;
    }
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const cardService = {
  createNew,
};
