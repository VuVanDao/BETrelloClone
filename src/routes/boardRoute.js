import express from "express";
import { StatusCodes } from "http-status-codes";
const boardRouter = express.Router();
boardRouter
  .route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "board" });
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ message: "done" });
  });

export default boardRouter;
