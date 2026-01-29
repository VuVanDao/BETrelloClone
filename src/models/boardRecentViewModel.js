import Joi from "joi";
import { OBJECTID_REGEX } from "../utils/constant.js";
import { getDB } from "../configs/ConnectDB.js";
import { ObjectId } from "mongodb";
import { boardModel } from "./boardModel.js";
const BOARD_RECENT_VIEW_NAME = "boardRecentView";
const BOARD_RECENT_VIEW_SCHEMA = Joi.object({
  accountId: Joi.string().pattern(OBJECTID_REGEX).required(),
  recentlyViewedBoard: Joi.array()
    .items(
      Joi.object({
        Id: Joi.string().pattern(OBJECTID_REGEX),
        AddedTime: Joi.date().timestamp("javascript").default(Date.now),
      }),
    )
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
const updateBoardRecentView = async (accountId, newRecentlyViewedBoard) => {
  let result = await getDB()
    .collection(BOARD_RECENT_VIEW_NAME)
    .findOneAndUpdate(
      {
        accountId: new ObjectId(accountId),
      },
      {
        $set: { recentlyViewedBoard: newRecentlyViewedBoard },
      },
      {
        returnDocument: true,
      },
    );
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
    // Aggregate: xử lý dữ liệu theo từng bước (pipeline)
    // Mỗi object trong mảng là 1 bước xử lý.
    // Link: https://chatgpt.com/c/697b2df3-4bc4-8324-bd23-871c45f02ccc
    .aggregate([
      { $match: { accountId: new ObjectId(accountId) } },
      // Tách từng board đã xem
      { $unwind: "$recentlyViewedBoard" },
      // Sắp xếp theo thời gian xem gần nhất
      {
        $sort: {
          "recentlyViewedBoard.AddedTime": -1,
        },
      },
      // Join sang bảng board
      {
        $lookup: {
          from: boardModel.BOARD_COLLECTION_NAME,
          localField: "recentlyViewedBoard.Id",
          foreignField: "_id",
          as: "board",
        },
      },
      { $unwind: "$board" },
      // Gom lại thành mảng
      {
        $group: {
          _id: "$_id",
          boards: {
            $push: {
              board: "$board",
              viewedAt: "$recentlyViewedBoard.AddedTime",
            },
          },
        },
      },
      // Chỉ lấy tối đa 5 board
      {
        $project: {
          boards: { $slice: ["$boards", 5] },
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
