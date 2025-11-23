import { StatusCodes } from "http-status-codes";
import { accountService } from "../services/accountService.js";
import ApiError from "../utils/ApiError.js";
async function invalidateCache(req, input) {
  // const cacheKey = `accountId:${input}`;
  // await req.redisClient.del(cacheKey);
  const keys = await req.redisClient.keys(`accounts:*`);
  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
}
const createNew = async (req, res, next) => {
  try {
    const result = await accountService.createNew(req.body);
    await invalidateCache(req, "");
    await res
      .status(StatusCodes.CREATED)
      .json({ message: "Created user complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
const findOneByAuth0Id = async (req, res, next) => {
  try {
    const { auth0Id } = req.params;
    if (!auth0Id) {
      next(new ApiError(StatusCodes.BAD_REQUEST, "Missing auth0Id"));
    }
    const result = await accountService.findOneByAuth0Id(auth0Id);
    const cacheKey = `accountId:${auth0Id}`;
    const cachedAccountDetail = await req.redisClient.get(cacheKey);
    if (cachedAccountDetail) {
      return res.status(StatusCodes.OK).json({
        message: `Get account with auth0Id ${auth0Id} successfully`,
        data: JSON.parse(cachedAccountDetail),
      });
    }
    // save your post in redis cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));
    res
      .status(StatusCodes.OK)
      .json({ message: "findOneByAuth0Id user complete", data: result });
  } catch (error) {
    next(new ApiError(StatusCodes.NOT_FOUND, new Error(error).message));
  }
};
export const accountController = {
  createNew,
  findOneByAuth0Id,
};
