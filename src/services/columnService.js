import { boardModel } from "../models/boardModel.js";
import { columnModel } from "../models/columnModel.js";

const createNew = async (data) => {
  try {
    const res = await columnModel.createNew(data);
    if (!res) return null;
    const result = await columnModel.findOneByID(res.insertedId);
    const AddColumnIdsToBoard = await boardModel.pushColumnToBoard(
      result._id,
      result.boardIds
    );
    if (!AddColumnIdsToBoard) {
      return null;
    }
    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};
export const columnService = {
  createNew,
};
