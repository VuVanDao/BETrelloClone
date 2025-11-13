import Joi from "joi";
import { BOARD_TYPES, OBJECTID_REGEX } from "../utils/constant.js";
import { getDB } from "../configs/ConnectDB.js";
import { ObjectId } from "mongodb";
import { columnModel } from "./columnModel.js";
import { cardModel } from "./cardModel.js";
const BOARD_COLLECTION_NAME = "boards";
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional().min(3).max(50).trim().strict(),
  slug: Joi.string().optional().min(3).trim().strict(),
  type: Joi.string()
    .valid(...Object.values(BOARD_TYPES))
    .required(),
  ownerIs: Joi.array().items(Joi.string().pattern(OBJECTID_REGEX)).default([]),
  memberIds: Joi.array().default([]),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECTID_REGEX))
    .default([]),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(Date.now()),
});
const validateData = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: "false",
  });
};
const createNew = async (data) => {
  try {
    const check = await validateData(data);
    if (!check) {
      return null;
    }
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
            localField: "_id",
            foreignField: "boardIds",
            as: "columns",
          },
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: "_id",
            foreignField: "boardIds",
            as: "cards",
          },
        },
      ])
      .toArray();
    return res[0] || {};
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
};
