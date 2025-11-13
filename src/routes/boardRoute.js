import express from "express";
import { boardValidation } from "../validations/boardValidation.js";
import { boardController } from "../controllers/boardController.js";
const boardRouter = express.Router();
boardRouter
  .route("/")
  .post(boardValidation.createNew, boardController.createNew);
boardRouter.route("/:id").get(boardController.getBoardDetail);
export default boardRouter;
