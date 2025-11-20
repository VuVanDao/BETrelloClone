import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { boardService } from "../services/boardService.js";

async function invalidateCache(req, input) {
  // const cacheKey = `boardId:${input}`;
  // await req.redisClient.del(cacheKey);
  const keys = await req.redisClient.keys(`boardId:*`);
  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
}
const createNew = async (req, res, next) => {
  try {
    const result = await boardService.createNew(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Created board complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
const getBoardDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(
        new ApiError(StatusCodes.BAD_REQUEST, "Board id is required")
      );
    }
    const result = await boardService.getBoardDetail(id);
    const cacheKey = `boardId:${id}`;
    const cachedBoardDetail = await req.redisClient.get(cacheKey);
    if (cachedBoardDetail) {
      return res.status(StatusCodes.OK).json({
        message: `Get board with id ${id} successfully`,
        data: JSON.parse(cachedBoardDetail),
      });
    }
    // save your post in redis cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));
    return res
      .status(StatusCodes.OK)
      .json({ message: "Find board complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
const updateColumnOrderIds = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { columnOrderIds } = req.body;
    const result = await boardService.updateColumnOrderIds({
      boardId: id,
      columnOrderIds: columnOrderIds,
    });
    await invalidateCache(req, "");
    return res
      .status(StatusCodes.OK)
      .json({ message: "Move column in board complete", data: result });
  } catch (error) {
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, new Error(error).message)
    );
  }
};
export const boardController = {
  createNew,
  getBoardDetail,
  updateColumnOrderIds,
};
