import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardValidation } from "../validations/boardValidation.js";
import { boardController } from "../controllers/boardController.js";
const boardRouter = express.Router();
boardRouter
  .route("/")
  .post(boardValidation.createNew, boardController.createNew)
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "board" });
  });
boardRouter.route("/:id").get(boardController.findOneByID);
export default boardRouter;
