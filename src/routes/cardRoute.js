import express from "express";
import { StatusCodes } from "http-status-codes";
const cardRouter = express.Router();
cardRouter
  .route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "card" });
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ message: "done" });
  });

export default cardRouter;
