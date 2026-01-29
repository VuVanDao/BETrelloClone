import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { boardRecentViewModel } from "../models/boardRecentViewModel.js";
import { ObjectId } from "mongodb";
import { RemoveItemExistInArr } from "../utils/RemoveItemExistsInArr.js";

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
    // y tuong cua cai recently viewed board ( Queue )
    const boardId = data?.boardId;
    const accountId = data?.accountId;
    if (checkLengthRecentlyViewedBoard) {
      let newRecentlyViewedBoard = RemoveItemExistInArr(
        checkLengthRecentlyViewedBoard?.recentlyViewedBoard,
        boardId,
      );
      newRecentlyViewedBoard.push({
        Id: new ObjectId(boardId),
        AddedTime: Date.now(),
      });
      res = await boardRecentViewModel.updateBoardRecentView(
        new ObjectId(accountId),
        newRecentlyViewedBoard, // mang sau khi duoc update
      );
    } else {
      res = await boardRecentViewModel.createNew({
        accountId: data?.accountId,
        recentlyViewedBoard: [
          { Id: new ObjectId(boardId), AddedTime: Date.now() },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
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
