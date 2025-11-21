import Joi from "joi";
import { ROLE } from "../utils/constant.js";
import { getDB } from "../configs/ConnectDB.js";

const ACCOUNT_COLLECTION_NAME = "accounts";
const ACCOUNT_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required().trim().strict(),
  authType: Joi.string().valid("local", "google", "facebook").default("local"),
  password: Joi.string()
    .trim()
    .strict()
    .when("authType", {
      is: "local",
      then: Joi.required(), // Nếu là local -> Bắt buộc
      otherwise: Joi.optional().allow(null, ""), // Nếu không -> Cho phép null hoặc rỗng
    }),
  username: Joi.string().required().trim().strict(),
  verifyToken: Joi.string().optional().default(""),
  avatar: Joi.string().optional().default(""),
  role: Joi.string()
    .valid(...Object.values(ROLE))
    .required(),
  isActive: Joi.boolean().default(false),
  createdAt: Joi.date().default(Date.now()),
  updatedAt: Joi.date().default(null),
  _destroy: Joi.string().valid(false, true),
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
export const AccountModel = {
  ACCOUNT_COLLECTION_NAME,
  ACCOUNT_COLLECTION_SCHEMA,
  createNew,
};
