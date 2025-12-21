import { boardRecentViewService } from "../services/boardRecentViewService.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

async function invalidateCache(req, input) {
  // const cacheKey = `boardId:${input}`;
  // await req.redisClient.del(cacheKey);
  const keys = await req.redisClient.keys(`boardRecentView:*`);
  if (keys?.length > 0) {
    await req.redisClient.del(keys);
  }
  const clientBoardsKey = await req.redisClient.keys(`boardRecentView:*`);
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
        "Create board recent view not complete"
      );
    }
    await invalidateCache(req, "");
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Create board recent view complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
  }
};
export const boardRecentViewController = {
  createNew,
};
