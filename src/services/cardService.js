import { cardModel } from "../models/cardModel.js";
import { columnModel } from "../models/columnModel.js";

const createNew = async (data) => {
  try {
    const result = await cardModel.createNewCard(data);
    if (!result) {
      return null;
    }
    const res = await cardModel.findOneById(result.insertedId);
    const addCardToColumn = await columnModel.pushCardIdToColumn(
      res.columnIds,
      res._id
    );
    if (!addCardToColumn) {
      return null;
    }
    return res || null;
  } catch (error) {
    throw new Error(error);
  }
};
export const cardService = {
  createNew,
};
