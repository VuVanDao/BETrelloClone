import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { cardService } from "../services/cardService.js";

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
    res
      .status(StatusCodes.OK)
      .json({ message: "Create card complete", data: result });
  } catch (error) {
    console.log("🚀 ~ createNew ~ error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
export const cardController = {
  createNew,
};
