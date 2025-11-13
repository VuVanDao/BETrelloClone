import Joi from "joi";
import { OBJECTID_REGEX } from "../utils/constant";
const COLUMN_COLLECTION_NAME = "columns";
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardIds: Joi.string().required().pattern(OBJECTID_REGEX),
  title: Joi.string().optional().min(3).max(50).trim().strict(),
  slug: Joi.string().optional().min(3).trim().strict(),
  cardOrderIds: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(Date.now()),
});
export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
};
