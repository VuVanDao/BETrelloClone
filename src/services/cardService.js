import { cardModel } from "../models/cardModel.js";

const createNew = async (data) => {
  try {
    const result = await cardModel.createNewCard(data);
    if (!result) {
      return null;
    }
    const res = await cardModel.findOneById(result.insertedId);
    return res || null;
  } catch (error) {
    throw new Error(error);
  }
};
export const cardService = {
  createNew,
};
