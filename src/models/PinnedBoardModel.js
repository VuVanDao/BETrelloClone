import Joi from "joi";
import { OBJECTID_REGEX } from "../utils/constant.js";
import { getDB } from "../configs/ConnectDB.js";
import { ObjectId } from "mongodb";
import { boardModel } from "./boardModel.js";
const PINNED_BOARD_NAME = "pinnedBoard";
const PINNED_BOARD_SCHEMA = Joi.object({
  accountId: Joi.string().pattern(OBJECTID_REGEX).required(),
  pinnedBoard: Joi.array()
    .items(Joi.string().pattern(OBJECTID_REGEX))
    .unique()
    .max(10)
    .default([]),
  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(Date.now()),
});
const createNew = async (data) => {
  data.accountId = new ObjectId(data.accountId);
  return await getDB().collection(PINNED_BOARD_NAME).insertOne(data);
};
const findOneByAccountId = async (accountId) => {
  try {
    if (!accountId) {
      return null;
    }
    const res = await getDB()
      .collection(PINNED_BOARD_NAME)
      .findOne({ accountId: new ObjectId(accountId) });
    return res || null;
  } catch (error) {
    throw new Error(error);
  }
};
const addPinnedBoard = async (accountId, data) => {
  let result = await getDB()
    .collection(PINNED_BOARD_NAME)
    .findOneAndUpdate({ accountId: new ObjectId(accountId) }, data, {
      returnDocument: "after",
    });
  return result;
};
const removePinnedBoard = async (accountId, query) => {
  let result = await getDB()
    .collection(PINNED_BOARD_NAME)
    .findOneAndUpdate({ accountId: new ObjectId(accountId) }, query, {
      returnDocument: "after",
    });
  return result;
};
const getAllPinnedBoard = async (accountId) => {
  let result = await getDB()
    .collection(PINNED_BOARD_NAME)
    //aggregate: xử lý dữ liệu theo từng bước (pipeline)
    // Mỗi object trong mảng là 1 bước xử lý.
    .aggregate([
      { $match: { accountId: new ObjectId(accountId) } },
      {
        $lookup: {
          from: boardModel.BOARD_COLLECTION_NAME,
          localField: "pinnedBoard",
          foreignField: "_id",
          as: "pinnedBoards",
        },
      },
    ])
    .toArray();
  return result[0] || [];
};
export const pinnedBoardModel = {
  PINNED_BOARD_NAME,
  PINNED_BOARD_SCHEMA,
  createNew,
  findOneByAccountId,
  addPinnedBoard,
  removePinnedBoard,
  getAllPinnedBoard,
};
