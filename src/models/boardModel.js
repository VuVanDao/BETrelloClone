import Joi from "joi";
import { OBJECTID_REGEX } from "../utils/constant.js";

import { getDB } from "../configs/ConnectDB.js";
import { ObjectId } from "mongodb";
const BOARD_COLLECTION_NAME = "boards";
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional().min(3).max(50).trim().strict(),
  slug: Joi.string().optional().min(3).trim().strict(),
  type: Joi.string().valid("public", "private", "protected").required(),
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
    const res = await getDB().collection(BOARD_COLLECTION_NAME).insertOne(data);
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
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneByID,
};
