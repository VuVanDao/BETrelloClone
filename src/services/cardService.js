import { StatusCodes } from "http-status-codes";
import { boardModel } from "../models/boardModel.js";
import { cardModel } from "../models/cardModel.js";
import { columnModel } from "../models/columnModel.js";
import ApiError from "../utils/ApiError.js";
import { columnService } from "./columnService.js";

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
const UpdateOneById = async (data) => {
  try {
    const { cardId, dataToUpdate } = data;
    if (!cardId || !dataToUpdate) {
      return new ApiError(StatusCodes.BAD_REQUEST, "Missing data to update");
    }
    const res = await cardModel.UpdateOneById(cardId, dataToUpdate);
    if (res.modifiedCount === 0 || res.matchedCount === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Update card failed");
    }
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const ArchivedCardById = async (data) => {
  try {
    const { cardId, dataToUpdate, columnId } = data;
    if (!cardId || !dataToUpdate) {
      return new ApiError(StatusCodes.BAD_REQUEST, "Missing data to update");
    }
    const res = await cardModel.UpdateOneById(cardId, dataToUpdate);
    if (res.modifiedCount === 0 || res.matchedCount === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Update card failed");
    }
    const currCol = await columnService.findOneByID(columnId);
    currCol.cardOrderIds = currCol.cardOrderIds.filter(
      (cardOrder) => cardOrder.toString() !== cardId
    );
    const currColChange = await columnService.updateCardOrderIds({
      columnId,
      cardOrderIds: currCol.cardOrderIds,
    });
    if (currColChange.modifiedCount === 0 || currColChange.matchedCount === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Update card failed");
    }
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneById = async (id) => {
  try {
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing id");
    }
    const res = await cardModel.findOneById(id);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const cardService = {
  createNew,
  UpdateOneById,
  ArchivedCardById,
  findOneById,
};
