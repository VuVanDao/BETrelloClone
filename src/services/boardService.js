import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { ConvertStringToSlug } from "../utils/StringToSlug.js";
import { boardModel } from "../models/boardModel.js";
import lodash from "lodash";
import {
  sortCardsByOrder,
  sortColumnsByOrder,
} from "../utils/SortByOrderIds.js";
const { cloneDeep } = lodash;
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
const getBoardDetail = async (id) => {
  try {
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing board id");
    }
    const res = await boardModel.getDetailBoards(id);
    if (!res) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found boar");
    }
    const resClone = cloneDeep(res);
    if (resClone?.columns.length > 0 && resClone?.columnOrderIds.length > 0) {
      resClone.columns = sortColumnsByOrder(
        resClone.columnOrderIds,
        resClone.columns
      );

      const cardList = {};
      resClone.cards.map((card) => {
        if (!cardList[card?.columnIds.toString()]) {
          cardList[card?.columnIds.toString()] = [];
        }
        cardList[card?.columnIds.toString()].push(card);
      });

      resClone.columns.forEach((column) => {
        if (cardList[column?._id.toString()]) {
          column.cards = sortCardsByOrder(
            column.cardOrderIds,
            cardList[column?._id.toString()]
          );
        }
      });
    }
    delete resClone.cards;
    return resClone;
  } catch (error) {
    throw new Error(error);
  }
};
const updateColumnOrderIds = async (data) => {
  try {
    const { boardId, columnOrderIds } = data;
    if (!boardId || !columnOrderIds) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Missing data to move column"
      );
    }
    let res = await boardModel.updateColumnOrderIds(boardId, columnOrderIds);
    if (!res || res.modifiedCount === 0 || res.matchedCount === 0) {
      return null;
    }
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByID = async (boardId) => {
  try {
    if (!boardId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to find board");
    }
    const res = await boardModel.findOneByID(boardId);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const boardService = {
  createNew,
  getBoardDetail,
  updateColumnOrderIds,
  findOneByID,
};
