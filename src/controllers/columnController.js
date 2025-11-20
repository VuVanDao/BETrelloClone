import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { columnService } from "../services/columnService.js";
import { cardService } from "../services/cardService.js";
import { ObjectId } from "mongodb";
async function invalidateCache(req, input) {
  const cacheKey = `boardId:${input}`;
  await req.redisClient.del(cacheKey);
  const keys = await req.redisClient.keys(`boardId:*`);
  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
}
const createNew = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing data");
    }
    const result = await columnService.createNew(req.body);
    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "create column not complete");
    }
    await invalidateCache(req, req.body.boardIds);
    return res
      .status(StatusCodes.OK)
      .json({ message: "create column complete", data: result });
  } catch (error) {
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, new Error(error).message)
    );
  }
};
const updateCardOrderIds = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cardOrderIds } = req.body;
    const result = await columnService.updateCardOrderIds({
      columnId: id,
      cardOrderIds: cardOrderIds,
    });
    await invalidateCache(req, "");
    return res
      .status(StatusCodes.OK)
      .json({ message: "Move card in column complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
const MoveCardDifferentColumn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nextCardOrderIds, preColumn, preCardOrderIds, activeCardId } =
      req.body;
    await columnService.updateCardOrderIds({
      columnId: preColumn,
      cardOrderIds: preCardOrderIds,
    });
    await columnService.updateCardOrderIds({
      columnId: id,
      cardOrderIds: nextCardOrderIds,
    });
    await cardService.UpdateOneById({
      cardId: activeCardId,
      dataToUpdate: { columnIds: new ObjectId(id), updatedAt: Date.now() },
    });
    await invalidateCache(req, "");

    return res
      .status(StatusCodes.OK)
      .json({ message: "Move card different column complete", data: null });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
const ArchivedColumn = async (req, res, next) => {
  try {
    const { columnId } = req.params;
    const result = await columnService.ArchivedColumn(columnId, req.body);
    await invalidateCache(req, "");
    return res
      .status(StatusCodes.OK)
      .json({ message: "Archived column", data: null });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
export const columnController = {
  createNew,
  updateCardOrderIds,
  MoveCardDifferentColumn,
  ArchivedColumn,
};
