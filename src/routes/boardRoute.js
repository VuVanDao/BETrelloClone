import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardValidation } from "../validations/boardValidation.js";
const boardRouter = express.Router();
boardRouter
  .route("/")
  .post(boardValidation.createNew)
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "board" });
  });

export default boardRouter;
