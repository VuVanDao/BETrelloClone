import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { ConvertStringToSlug } from "../utils/StringToSlug.js";
import { boardModel } from "../models/boardModel.js";
import lodash from "lodash";
import {
  sortCardsByOrder,
  sortColumnsByOrder,
} from "../utils/SortByOrderIds.js";
import { ObjectId } from "mongodb";
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
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found board");
    }
    const resClone = cloneDeep(res);
    if (resClone?.columns.length > 0 && resClone?.columnOrderIds.length > 0) {
      resClone.columns = sortColumnsByOrder(
        resClone.columnOrderIds,
        resClone.columns,
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
            cardList[column?._id.toString()],
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
        "Missing data to move column",
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
const pullColumnToBoard = async (ArrayToPull, boardId) => {
  try {
    if (!ArrayToPull || !ArrayToPull.length === 0 || !boardId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data");
    }
    const query = { $in: [...ArrayToPull] };
    const res = await boardModel.pullColumnToBoard(query, boardId);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const getAllBoard = async (page, limit, sortBy, sortOrder, accountId) => {
  try {
    const skip = (page - 1) * limit;
    sortBy = sortBy || "updatedAt";
    sortOrder = sortOrder === "asc" ? 1 : -1;
    const sortObj = {};
    sortObj[sortBy] = sortOrder; // sort theo trường nào
    const queryCondition = [
      { _destroy: false },
      {
        $or: [
          { memberIds: { $in: [new ObjectId(accountId)] } },
          { ownerIds: { $in: [new ObjectId(accountId)] } },
        ],
      },
    ];
    const res = await boardModel.getAllBoard(
      sortObj,
      skip,
      limit,
      queryCondition,
    );
    const totalPage = Math.ceil(res.totalBoard / limit);
    return { result: res.result, totalBoard: res.totalBoard, totalPage };
  } catch (error) {
    throw new Error(error);
  }
};
export const boardService = {
  createNew,
  getBoardDetail,
  updateColumnOrderIds,
  findOneByID,
  pullColumnToBoard,
  getAllBoard,
};
