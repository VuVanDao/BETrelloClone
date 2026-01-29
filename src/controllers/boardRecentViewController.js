import { boardRecentViewService } from "../services/boardRecentViewService.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

async function invalidateCache(req, input) {
  // const cacheKey = `boardId:${input}`;
  // await req.redisClient.del(cacheKey);
  const keys = await req.redisClient.keys(`RecentlyViewedBoard:*`);
  if (keys?.length > 0) {
    await req.redisClient.del(keys);
  }
  const clientBoardsKey = await req.redisClient.keys(`RecentlyViewedBoards:*`);
  if (clientBoardsKey?.length > 0) {
    await req.redisClient.del(clientBoardsKey);
  }
}
const createNew = async (req, res, next) => {
  try {
    if (!req.body.boardId || !req.body.accountId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data");
    }
    const result = await boardRecentViewService.createNew({
      boardId: req.body.boardId,
      accountId: req.body.accountId,
    });
    if (!result) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Create recently viewed board not complete",
      );
    }
    await invalidateCache(req, "");
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Create recently viewed board complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
  }
};
const getRecentlyViewedBoard = async (req, res, next) => {
  try {
    const accountId = req.params.accountId;
    const cacheKey = `RecentlyViewedBoards:accountId=${accountId}`;
    const RecentlyViewedBoards = await req.redisClient.get(cacheKey);
    if (RecentlyViewedBoards) {
      return res.status(StatusCodes.OK).json({
        message: `Get recently viewed board with account ${accountId} successfully`,
        data: JSON.parse(RecentlyViewedBoards),
      });
    }
    const result =
      await boardRecentViewService.getRecentlyViewedBoard(accountId);
    // save your post in redis cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));
    return res
      .status(StatusCodes.OK)
      .json({ message: "Find recently viewed board complete", data: result });
  } catch (error) {
    next(error);
  }
};
export const boardRecentViewController = {
  createNew,
  getRecentlyViewedBoard,
};
