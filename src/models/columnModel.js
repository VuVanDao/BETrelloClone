import Joi from "joi";
import { OBJECTID_REGEX } from "../utils/constant.js";
import { getDB } from "../configs/ConnectDB.js";
import { ObjectId } from "mongodb";
const COLUMN_COLLECTION_NAME = "columns";
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardIds: Joi.string().required().pattern(OBJECTID_REGEX),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().optional().min(3).trim().strict(),
  cardOrderIds: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(Date.now()),
});
const validateCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data);
};
const createNew = async (data) => {
  try {
    const result = await validateCreate(data);
    if (!result) {
      return null;
    }
    const newColumn = {
      ...result,
      boardIds: new ObjectId(result.boardIds),
    };
    const res = await getDB()
      .collection(COLUMN_COLLECTION_NAME)
      .insertOne(newColumn);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByID = async (id) => {
  try {
    const result = await getDB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOne({ _id: id });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const pushCardIdToColumn = async (columnIds, cardIds) => {
  try {
    if (!columnIds || !cardIds) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Missing columnIds or cardIds"
      );
    }
    const res = await getDB()
      .collection(COLUMN_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(columnIds) },
        { $push: { cardOrderIds: new ObjectId(cardIds) } }
      );
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneByID,
  pushCardIdToColumn,
};
