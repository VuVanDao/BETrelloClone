import { pinnedBoardService } from "../services/pinnedBoardService.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

async function invalidateCache(req, input) {
  // const cacheKey = `boardId:${input}`;
  // await req.redisClient.del(cacheKey);
  const keys = await req.redisClient.keys(`pinnedBoard:*`);
  if (keys?.length > 0) {
    await req.redisClient.del(keys);
  }
  const pinnedBoardKey = await req.redisClient.keys(`pinnedBoard:*`);
  if (pinnedBoardKey?.length > 0) {
    await req.redisClient.del(pinnedBoardKey);
  }
  const clientBoardsKey = await req.redisClient.keys(`clientBoards:*`);
  if (clientBoardsKey?.length > 0) {
    await req.redisClient.del(clientBoardsKey);
  }
}
const createNew = async (req, res, next) => {
  try {
    if (!req.body.boardId || !req.body.accountId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data");
    }
    const result = await pinnedBoardService.createNew({
      boardId: req.body.boardId,
      accountId: req.body.accountId,
    });
    if (!result) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Create pinned board not complete"
      );
    }
    await invalidateCache(req, "");
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Create pinned board complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
  }
};
const removePinnedBoard = async (req, res, next) => {
  try {
    if (!req.body.boardId || !req.body.accountId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data");
    }
    const result = await pinnedBoardService.removePinnedBoard({
      boardId: req.body.boardId,
      accountId: req.body.accountId,
    });
    if (!result) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Remove pinned board not complete"
      );
    }
    await invalidateCache(req, "");
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Remove pinned board complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
  }
};
export const pinnedBoardController = {
  createNew,
  removePinnedBoard,
};
