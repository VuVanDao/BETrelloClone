import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { boardRecentViewModel } from "../models/boardRecentViewModel.js";
import { ObjectId } from "mongodb";

const createNew = async (data) => {
  try {
    if (!data) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to create");
    }
    let res = "";
    // step 1
    // tim cai danh sach recently viewed board
    let checkLengthRecentlyViewedBoard =
      await boardRecentViewModel.findOneByAccountId(data?.accountId);
    // step 2
    // link : https://gemini.google.com/app/e9857b178cc55a00
    // link chua y tuong cua cai recently viewed board ( Queue )
    const boardId = data?.boardId;
    const accountId = data?.accountId;
    if (checkLengthRecentlyViewedBoard) {
      res = await boardRecentViewModel.updateBoardRecentView(
        new ObjectId(accountId),
        new ObjectId(boardId),
      );
    } else {
      res = await boardRecentViewModel.createNew({
        accountId: data?.accountId,
        boardRecentView: [new ObjectId(boardId)],
      });
    }
    if (!res) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Update board recent view not complete",
      );
    }
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
const getRecentlyViewedBoard = async (accountId) => {
  try {
    const result = await boardRecentViewModel.getRecentlyViewedBoard(accountId);
    return result;
  } catch (error) {
    throw error;
  }
};
export const boardRecentViewService = {
  createNew,
  getRecentlyViewedBoard,
};
