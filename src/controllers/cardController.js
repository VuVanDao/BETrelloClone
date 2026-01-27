import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { cardService } from "../services/cardService.js";

async function invalidateCache(req, input) {
  const boardIdCache = `boardId:${input}`;
  await req.redisClient.del(boardIdCache);
  const keys = await req.redisClient.keys(`boardId:*`);
  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
}
const createNew = async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data");
    }
    const result = await cardService.createNew(req?.body);
    if (!result) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Create card not complete", data: null });
    }
    await invalidateCache(req, req?.body?.boardIds);
    res
      .status(StatusCodes.OK)
      .json({ message: "Create card complete", data: result });
  } catch (error) {
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, new Error(error).message),
    );
  }
};
const UpdateOneById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { data, columnId } = req.body;
    if (!req.body || !cardId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data");
    }
    const result = await cardService.ArchivedCardById({
      cardId,
      dataToUpdate: { ...data },
      columnId,
    });
    if (!result) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Archived card not complete", data: null });
    }
    await invalidateCache(req, "");
    res
      .status(StatusCodes.OK)
      .json({ message: "Archived card complete", data: null });
  } catch (error) {
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, new Error(error).message),
    );
  }
};
const findOneById = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    if (!cardId) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, "CardId is required"));
    }
    const cacheKey = `cardId:${cardId}`;
    const cachedCard = await req.redisClient.get(cacheKey);
    if (cachedCard) {
      return res.status(StatusCodes.OK).json({
        message: "find card complete with id " + cardId,
        data: JSON.parse(cachedCard),
      });
    }
    const result = await cardService.findOneById(cardId);
    // save your post in redis cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));
    return res
      .status(StatusCodes.OK)
      .json({ message: "find card complete", data: result });
  } catch (error) {
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, new Error(error).message),
    );
  }
};
export const cardController = {
  createNew,
  UpdateOneById,
  findOneById,
};
