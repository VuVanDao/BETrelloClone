import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { pinnedBoardModel } from "../models/PinnedBoardModel.js";
import { ObjectId } from "mongodb";
import { boardModel } from "../models/boardModel.js";

const createNew = async (data) => {
  try {
    if (!data) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to create");
    }
    let checkLengthPinnedBoard = await pinnedBoardModel.findOneByAccountId(
      data?.accountId
    );
    if (
      checkLengthPinnedBoard &&
      checkLengthPinnedBoard?.pinnedBoard &&
      checkLengthPinnedBoard?.pinnedBoard?.length > 0
    ) {
      let res = null;
      // Check if the pinned board has 5 items
      if (checkLengthPinnedBoard?.pinnedBoard?.length >= 5) {
        // res = await pinnedBoardModel.addPinnedBoard(data?.accountId, {
        //   $push: {
        //     pinnedBoard: {
        //       $each: [new ObjectId(data?.boardId)],
        //       $position: 0,
        //       $slice: 5,
        //     },
        //   },
        // });
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Pinned board has max 5 items"
        );
      } else {
        res = await pinnedBoardModel.addPinnedBoard(data?.accountId, {
          $push: { pinnedBoard: new ObjectId(data?.boardId) },
        });
      }
      if (!res) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Update board recent view not complete"
        );
      }
      //update cai board được pinned
      await boardModel.updateBoard(data?.boardId, { $set: { pinned: true } });
      return true;
    }
    let res = await pinnedBoardModel.createNew({
      accountId: data?.accountId,
      pinnedBoard: [new ObjectId(data?.boardId)],
    });
    if (res && res?.insertedId) {
      //update cai board được pinned
      await boardModel.updateBoard(data?.boardId, { $set: { pinned: true } });
      return true;
    }
  } catch (error) {
    throw new Error(error);
  }
};
const removePinnedBoard = async (data) => {
  try {
    if (!data || !data?.boardId || !data?.accountId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to remove");
    }

    let res = await pinnedBoardModel.removePinnedBoard(data?.accountId, {
      $pull: { pinnedBoard: new ObjectId(data?.boardId) },
    });
    await boardModel.updateBoard(data?.boardId, { $set: { pinned: false } });

    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const pinnedBoardService = {
  createNew,
  removePinnedBoard,
};
