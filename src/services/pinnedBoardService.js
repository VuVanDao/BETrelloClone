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
    // tim cai danh sach pinned board
    let checkLengthPinnedBoard = await pinnedBoardModel.findOneByAccountId(
      data?.accountId,
    );
    const boardId = data?.boardId;
    //check xem boardId da co trong pinned board chua
    if (
      checkLengthPinnedBoard?.pinnedBoard?.some((id) => {
        return id.equals(new ObjectId(boardId));
      })
    ) {
      throw new ApiError(StatusCodes.ACCEPTED, "Board này đã được pin");
    }

    // Check if the pinned board has 5 items
    if (checkLengthPinnedBoard?.pinnedBoard?.length >= 5) {
      // thì waring : tối đa 5 pinned board
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Pinned board has max 5 items",
      );
    }
    let res = null;
    if (checkLengthPinnedBoard) {
      res = await pinnedBoardModel.addPinnedBoard(data?.accountId, {
        $push: { pinnedBoard: new ObjectId(boardId) },
      });
    } else {
      res = await pinnedBoardModel.createNew({
        accountId: data?.accountId,
        pinnedBoard: [new ObjectId(boardId)],
      });
    }
    if (!res) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Update board recent view not complete",
      );
    }
    //update cai board được pinned
    await boardModel.updateBoard(boardId, { $set: { pinned: true } });
    return true;
  } catch (error) {
    throw error;
  }
};
const removePinnedBoard = async (data) => {
  try {
    if (!data || !data?.boardId || !data?.accountId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data to remove");
    }
    const accountId = data?.accountId;
    const boardId = data?.boardId;
    const currPinnedBoard =
      await pinnedBoardModel.findOneByAccountId(accountId);
    //check xem boardId da co trong pinned board khong
    if (
      !currPinnedBoard?.pinnedBoard?.some((id) => {
        return id.equals(new ObjectId(boardId));
      })
    ) {
      throw new ApiError(
        StatusCodes.ACCEPTED,
        "Board này không có trong danh sách",
      );
    }
    let res = await pinnedBoardModel.removePinnedBoard(data?.accountId, {
      $pull: { pinnedBoard: new ObjectId(data?.boardId) },
    });
    // update board bi removed
    await boardModel.updateBoard(data?.boardId, { $set: { pinned: false } });

    return res;
  } catch (error) {
    throw error;
  }
};
const getAllPinnedBoard = async (accountId) => {
  try {
    const result = await pinnedBoardModel.getAllPinnedBoard(accountId);
    return result;
  } catch (error) {
    throw error;
  }
};
export const pinnedBoardService = {
  createNew,
  removePinnedBoard,
  getAllPinnedBoard,
};
