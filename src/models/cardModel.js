import Joi from "joi";
import { OBJECTID_REGEX } from "../utils/constant.js";
import { ObjectId } from "mongodb";
import { getDB } from "../configs/ConnectDB.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
const CARD_COLLECTION_NAME = "cards";
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardIds: Joi.string().required().pattern(OBJECTID_REGEX),
  columnIds: Joi.string().required().pattern(OBJECTID_REGEX),
  cover: Joi.string().default(null),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional().min(3).max(250).default(""),
  memberIds: Joi.array().default([]),
  comment: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().pattern(OBJECTID_REGEX),
      })
    )
    .default([]),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(Date.now()),
});
const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data);
};
const createNewCard = async (data) => {
  try {
    const result = await validateBeforeCreate(data);
    if (!result) {
      return null;
    }
    const dataToCreate = {
      ...result,
      boardIds: new ObjectId(result.boardIds),
      columnIds: new ObjectId(result.columnIds),
    };
    const res = await getDB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne(dataToCreate);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneById = async (id) => {
  try {
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing id to find");
    }
    const res = await getDB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return res || null;
  } catch (error) {
    throw new Error(error);
  }
};
export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNewCard,
  findOneById,
};
