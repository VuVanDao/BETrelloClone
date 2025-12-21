import Joi from "joi";
import { OBJECTID_REGEX } from "../utils/constant.js";
import { getDB } from "../configs/ConnectDB.js";
import { ObjectId } from "mongodb";
const BOARD_RECENT_VIEW_NAME = "boardRecentView";
const BOARD_RECENT_VIEW_SCHEMA = Joi.object({
  accountId: Joi.string().pattern(OBJECTID_REGEX).required(),
  boardRecentView: Joi.array()
    .items(Joi.string().pattern(OBJECTID_REGEX))
    .max(2)
    .default([]),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(Date.now()),
});
const createNew = async (data) => {
  data.accountId = new ObjectId(data.accountId);
  return await getDB().collection(BOARD_RECENT_VIEW_NAME).insertOne(data);
};
const findOneByAccountId = async (accountId) => {
  try {
    if (!accountId) {
      return null;
    }
    const res = await getDB()
      .collection(BOARD_RECENT_VIEW_NAME)
      .findOne({ accountId: new ObjectId(accountId) });
    return res || null;
  } catch (error) {
    throw new Error(error);
  }
};
const updateBoardRecentView = async (accountId, data) => {
  let result = await getDB()
    .collection(BOARD_RECENT_VIEW_NAME)
    .findOneAndUpdate({ accountId: new ObjectId(accountId) }, data, {
      returnDocument: "after",
    });
  return result;
};
const deleteBoardRecentView = async (accountId) => {
  return await getDB()
    .collection(BOARD_RECENT_VIEW_NAME)
    .deleteOne({ accountId });
};
export const boardRecentViewModel = {
  BOARD_RECENT_VIEW_NAME,
  BOARD_RECENT_VIEW_SCHEMA,
  createNew,
  findOneByAccountId,
  updateBoardRecentView,
  // deleteBoardRecentView,
};
