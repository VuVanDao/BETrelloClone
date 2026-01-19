import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { boardRecentViewModel } from "../models/boardRecentViewModel.js";
import { ObjectId } from "mongodb";

const createNew = async (data) => {
  try {
    if (!data) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to create");
    }
    let checkLengthRecentView = await boardRecentViewModel.findOneByAccountId(
      data?.accountId
    );
    // Check if the board recent view exists
    if (
      checkLengthRecentView &&
      checkLengthRecentView?.boardRecentView &&
      checkLengthRecentView?.boardRecentView?.length > 0
    ) {
      let res = null;
      // Check if the board recent view has 4 items
      if (checkLengthRecentView?.boardRecentView?.length >= 2) {
        res = await boardRecentViewModel.updateBoardRecentView(
          data?.accountId,
          {
            $push: {
              boardRecentView: {
                $each: [new ObjectId(data?.boardId)],
                $position: 0,
                $slice: 2,
              },
            },
          }
        );
      } else {
        res = await boardRecentViewModel.updateBoardRecentView(
          data?.accountId,
          { $push: { boardRecentView: new ObjectId(data?.boardId) } }
        );
      }
      if (!res) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Update board recent view not complete"
        );
      }
      return true;
    }
    let res = await boardRecentViewModel.createNew({
      accountId: data?.accountId,
      boardRecentView: [new ObjectId(data?.boardId)],
    });
    if (res && res?.insertedId) {
      return true;
    }
  } catch (error) {
    throw new Error(error);
  }
};
export const boardRecentViewService = {
  createNew,
};
