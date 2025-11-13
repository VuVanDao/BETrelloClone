import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { ConvertStringToSlug } from "../utils/StringToSlug.js";
import { boardModel } from "../models/boardModel.js";
import lodash from "lodash";
const { cloneDeep } = lodash;
const createNew = async (data) => {
  try {
    if (!data) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to create");
    }
    const newBoard = {
      ...data,
      slug: ConvertStringToSlug(data.title),
    };
    let res = await boardModel.createNew(newBoard);
    if (res && res?.insertedId) {
      res = await boardModel.findOneByID(res?.insertedId);
    }
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const getBoardDetail = async (id) => {
  try {
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing board id");
    }
    const res = await boardModel.getDetailBoards(id);
    if (!res) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found boar");
    }
    const resClone = cloneDeep(res);
    resClone.columns.map((column) => {
      const cardFound = resClone.cards.filter(
        (card) => card.columnIds.toString() === column._id.toString()
      );
      column.cards = [...cardFound];
    });
    resClone.columnOrderIds = resClone.columns.map((column) =>
      column._id.toString()
    );
    delete resClone.cards;
    return resClone;
  } catch (error) {
    throw new Error(error);
  }
};
export const boardService = {
  createNew,
  getBoardDetail,
};
