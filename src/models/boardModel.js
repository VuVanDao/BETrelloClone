import Joi from "joi";
import { BOARD_TYPES, OBJECTID_REGEX, STATUS } from "../utils/constant.js";
import { getDB } from "../configs/ConnectDB.js";
import { ObjectId } from "mongodb";
import { columnModel } from "./columnModel.js";
import { cardModel } from "./cardModel.js";
const BOARD_COLLECTION_NAME = "boards";
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional().min(3).max(50).trim().strict(),
  slug: Joi.string().optional().min(3).trim().trim().strict(),
  type: Joi.string()
    .valid(...Object.values(BOARD_TYPES))
    .required(),
  ownerIds: Joi.array().items(Joi.string().pattern(OBJECTID_REGEX)).default([]),
  memberIds: Joi.array().default([]),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECTID_REGEX))
    .default([]),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(Date.now()),
  _destroy: Joi.valid(...Object.values(STATUS)).default(false),
});
const INVALID_UPDATE = ["_id", "createdAt"];
const validateData = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: "false",
  });
};
const createNew = async (data) => {
  console.log("🚀 ~ createNew ~ data:", data);
  try {
    const check = await validateData(data);
    console.log("🚀 ~ createNew ~ check:", check);
    if (!check) {
      return null;
    }
    check.ownerIds[0] = new ObjectId(check.ownerIds[0]);
    const res = await getDB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(check);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByID = async (id) => {
  try {
    const res = await getDB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const getDetailBoards = async (id) => {
  try {
    const res = await getDB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            let: { boardId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    // $expr cho phép bạn dùng biểu thức (expression) trong MongoDB, bao gồm:
                    // So sánh field với field,
                    // So sánh field với biến ($$),
                    // Dùng toán tử như $eq, $gt, $and, $in,
                    $and: [
                      { $eq: ["$$boardId", "$boardIds"] },
                      //$fieldName: để tham chiếu field trong document hiện đang được xử lý,nghĩa là lấy giá trị của field boardIds trong document column.
                      //$$variableName: Dùng để tham chiếu biến được khai báo bởi let: trong $lookup, $project, $facet,
                      { $eq: ["$_destroy", false] },
                    ],
                  },
                },
              },
            ],
            as: "columns",
          },
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            let: { boardId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$$boardId", "$boardIds"],
                      },
                      { $eq: ["$_destroy", false] },
                    ],
                  },
                },
              },
            ],
            as: "cards",
          },
        },
      ])
      .toArray();
    return res[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};
const pushColumnToBoard = async (columnIds, boardIds) => {
  try {
    const res = await getDB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(boardIds) },
        { $push: { columnOrderIds: new ObjectId(columnIds) } },
        { returnDocument: "after" }
      );
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const updateColumnOrderIds = async (boardId, columnOrderIds) => {
  try {
    const dataColumnOrderIds = columnOrderIds.map(
      (column) => new ObjectId(column)
    );
    const res = await getDB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(boardId),
        },
        {
          $set: { columnOrderIds: dataColumnOrderIds },
        },
        {
          returnDocument: "after",
        }
      );
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const pullColumnToBoard = async (ArrayToPull, boardIds) => {
  try {
    const res = await getDB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(boardIds) },
        { $pull: { columnOrderIds: ArrayToPull } },
        { returnDocument: "after" }
      );
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const getAllBoard = async (sortObj, skip, limit, queryCondition) => {
  try {
    const res = await getDB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        { $match: { $and: queryCondition } },
        { $sort: sortObj },
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: limit },
              { $project: { columnOrderIds: 0 } },
            ],
            totalCount: [{ $count: "TotalBoard" }],
          },
        },
      ])
      .toArray();
    return (
      {
        result: res[0]?.data || null,
        totalBoard: res[0]?.totalCount[0]?.TotalBoard || null,
      } || null
    );
  } catch (error) {
    throw new Error(error);
  }
};
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneByID,
  getDetailBoards,
  pushColumnToBoard,
  updateColumnOrderIds,
  pullColumnToBoard,
  getAllBoard,
};
