import Joi from "joi";
import { OBJECTID_REGEX } from "../utils/constant.js";
import { getDB } from "../configs/ConnectDB.js";
import { ObjectId } from "mongodb";
import { boardModel } from "./boardModel.js";
const BOARD_RECENT_VIEW_NAME = "boardRecentView";
const BOARD_RECENT_VIEW_SCHEMA = Joi.object({
  accountId: Joi.string().pattern(OBJECTID_REGEX).required(),
  boardRecentView: Joi.array()
    .items(Joi.string().pattern(OBJECTID_REGEX))
    .unique()
    .max(5)
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
const updateBoardRecentView = async (accountId, boardId) => {
  let result = await getDB()
    .collection(BOARD_RECENT_VIEW_NAME)
    .bulkWrite([
      {
        // Bước 1: Xóa board cũ nếu đã tồn tại trong mảng để tránh trùng
        updateOne: {
          filter: { accountId: accountId },
          update: { $pull: { boardRecentView: boardId } },
        },
      },
      {
        // Bước 2: Đẩy board mới vào cuối và giới hạn mảng còn 5 phần tử
        updateOne: {
          filter: { accountId: accountId },
          update: {
            $push: {
              boardRecentView: {
                $each: [boardId],
                $slice: -5, // Chỉ giữ lại 5 phần tử cuối cùng
              },
            },
          },
        },
      },
    ]);
  return result;
};
const deleteBoardRecentView = async (accountId) => {
  return await getDB()
    .collection(BOARD_RECENT_VIEW_NAME)
    .deleteOne({ accountId });
};
const getRecentlyViewedBoard = async (accountId) => {
  let result = await getDB()
    .collection(BOARD_RECENT_VIEW_NAME)
    //aggregate: xử lý dữ liệu theo từng bước (pipeline)
    // Mỗi object trong mảng là 1 bước xử lý.
    .aggregate([
      { $match: { accountId: new ObjectId(accountId) } },
      {
        $lookup: {
          from: boardModel.BOARD_COLLECTION_NAME,
          localField: "boardRecentView",
          foreignField: "_id",
          as: "RecentlyViewedBoard",
        },
      },
    ])
    .toArray();
  return result[0] || [];
};
export const boardRecentViewModel = {
  BOARD_RECENT_VIEW_NAME,
  BOARD_RECENT_VIEW_SCHEMA,
  createNew,
  findOneByAccountId,
  updateBoardRecentView,
  deleteBoardRecentView,
  getRecentlyViewedBoard,
};
