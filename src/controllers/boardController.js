import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { boardService } from "../services/boardService.js";

async function invalidateCache(req, input) {
  // const cacheKey = `boardId:${input}`;
  // await req.redisClient.del(cacheKey);
  const keys = await req.redisClient.keys(`boardId:*`);
  if (keys?.length > 0) {
    await req.redisClient.del(keys);
  }
  const clientBoardsKey = await req.redisClient.keys(`clientBoards:*`);
  if (clientBoardsKey?.length > 0) {
    await req.redisClient.del(clientBoardsKey);
  }
}
const createNew = async (req, res, next) => {
  try {
    const ownerId = req.jwtDecoded.id;
    const result = await boardService.createNew({
      ...req.body,
      ownerIds: [ownerId],
    });
    await invalidateCache(req, "");
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
    const AccountId = req.jwtDecoded.id;

    if (!id) {
      return next(
        new ApiError(StatusCodes.BAD_REQUEST, "Board id is required"),
      );
    }
    const cacheKey = `boardId:${id}&accountId=${AccountId}`;
    const cachedBoardDetail = await req.redisClient.get(cacheKey);
    if (cachedBoardDetail) {
      return res.status(StatusCodes.OK).json({
        message: `Get board with id ${id} successfully`,
        data: JSON.parse(cachedBoardDetail),
      });
    }
    const result = await boardService.getBoardDetail(id);
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
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, new Error(error).message),
    );
  }
};
const getAllBoard = async (req, res, next) => {
  try {
    const id = req.jwtDecoded.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const cacheKey = `clientBoards:page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&accountId=${id}`;
    const cachedClientBoards = await req.redisClient.get(cacheKey);
    if (cachedClientBoards) {
      console.log("in cache");

      return res.status(StatusCodes.OK).json({
        message: `Get client boards with account id ${id} successfully`,
        data: JSON.parse(cachedClientBoards),
      });
    }
    const result = await boardService.getAllBoard(
      page,
      limit,
      sortBy,
      sortOrder,
      id,
    );
    result.currPage = page;

    // save your post in redis cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));
    return res
      .status(StatusCodes.OK)
      .json({ message: "Get client board complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
export const boardController = {
  createNew,
  getBoardDetail,
  updateColumnOrderIds,
  getAllBoard,
};
