import express from "express";
import { StatusCodes } from "http-status-codes";
import { cardValidation } from "../validations/cardValidation";
const cardRouter = express.Router();
cardRouter
  .route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "card" });
  })
  .post(cardValidation.createNew);

export default cardRouter;
