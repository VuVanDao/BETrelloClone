import express from "express";
import { StatusCodes } from "http-status-codes";
import { columnValidation } from "../validations/columnValidation.js";
import { columnController } from "../controllers/columnController.js";
const columnRouter = express.Router();
columnRouter
  .route("/")
  .post(columnValidation.createNew, columnController.createNew);
columnRouter
  .route("/:id")
  .put(columnValidation.updateCard, columnController.updateCardOrderIds);
columnRouter
  .route("/move_card_different_column/:id")
  .put(columnController.MoveCardDifferentColumn);

export default columnRouter;
