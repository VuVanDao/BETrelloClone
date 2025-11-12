import { StatusCodes } from "http-status-codes";

const createNew = (req, res) => {
  try {
    console.log("🚀 ~ createNew ~ req.body:", req.body);
    res.status(StatusCodes.OK).json({ message: "redirect to boardService" });
  } catch (error) {
    console.log("🚀 ~ createNew ~ error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
export const boardController = {
  createNew,
};
