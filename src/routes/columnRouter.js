import express from "express";
import { StatusCodes } from "http-status-codes";
const columnRouter = express.Router();
columnRouter
  .route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "column" });
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ message: "done" });
  });

export default columnRouter;
