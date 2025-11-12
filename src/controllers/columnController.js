import { StatusCodes } from "http-status-codes";

const createNew = (req, res) => {
  try {
    console.log("🚀 ~ createNew ~ req.body:", req.body);
    res.status(StatusCodes.OK).json({ message: "redirect to columnService" });
  } catch (error) {
    console.log("🚀 ~ createNew ~ error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
export const columnController = {
  createNew,
};
