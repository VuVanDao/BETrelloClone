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
  const AllPinnedBoard = await req.redisClient.keys(`AllPinnedBoard:*`);
  if (AllPinnedBoard?.length > 0) {
    await req.redisClient.del(AllPinnedBoard);
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
        "Create pinned board not complete",
      );
    }
    await invalidateCache(req, "");
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Create pinned board complete", data: result });
  } catch (error) {
    next(error);
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
        "Remove pinned board not complete",
      );
    }
    await invalidateCache(req, "");
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Remove pinned board complete", data: result });
  } catch (error) {
    next(error);
  }
};
const getAllPinnedBoard = async (req, res, next) => {
  try {
    const accountId = req.params.accountId;
    const cacheKey = `AllPinnedBoard:accountId=${accountId}`;
    const pinnedBoard = await req.redisClient.get(cacheKey);
    if (pinnedBoard) {
      return res.status(StatusCodes.OK).json({
        message: `Get pinned board with account ${accountId} successfully`,
        data: JSON.parse(pinnedBoard),
      });
    }
    const result = await pinnedBoardService(accountId);
    // save your post in redis cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));
    return res
      .status(StatusCodes.OK)
      .json({ message: "Find pinned board complete", data: result });
  } catch (error) {
    next(error);
  }
};
export const pinnedBoardController = {
  createNew,
  removePinnedBoard,
  getAllPinnedBoard,
};
