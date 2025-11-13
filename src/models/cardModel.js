import Joi from "joi";
import { OBJECTID_REGEX } from "../utils/constant";
const CARD_COLLECTION_NAME = "cards";
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardIds: Joi.string().required().pattern(OBJECTID_REGEX),
  columnIds: Joi.string().required().pattern(OBJECTID_REGEX),
  cover: Joi.string().default(null),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string()
    .optional()
    .min(3)
    .max(50)
    .trim()
    .strict()
    .default(""),
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
export const boardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
};
