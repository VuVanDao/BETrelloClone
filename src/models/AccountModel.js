import Joi from "joi";
import { ROLE } from "../utils/constant.js";
import { getDB } from "../configs/ConnectDB.js";
import { ObjectId } from "mongodb";

const ACCOUNT_COLLECTION_NAME = "accounts";
const ACCOUNT_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().trim().strict().default(""),
  username: Joi.string().required().trim().strict(),
  // Đặt là string optional lúc validate input, nhưng bắt buộc khi lưu vào DB
  auth0Id: Joi.string().optional().trim(),
  avatar: Joi.string().default(null),
  role: Joi.string()
    .valid(...Object.values(ROLE))
    .default("client"), // Nên có giá trị mặc định
  isActive: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});
const validateData = async (data) => {
  return await ACCOUNT_COLLECTION_SCHEMA.validateAsync(data, {
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
      .collection(ACCOUNT_COLLECTION_NAME)
      .insertOne(check);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneById = async (accountId) => {
  try {
    if (!accountId) {
      return null;
    }
    const res = await getDB()
      .collection(ACCOUNT_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(accountId) });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByAuth0Id = async (auth0Id) => {
  try {
    if (!auth0Id) {
      return null;
    }
    const res = await getDB()
      .collection(ACCOUNT_COLLECTION_NAME)
      .findOne({ auth0Id: auth0Id });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const AccountModel = {
  ACCOUNT_COLLECTION_NAME,
  ACCOUNT_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByAuth0Id,
};
