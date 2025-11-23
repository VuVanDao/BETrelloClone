import express from "express";
import { boardValidation } from "../validations/boardValidation.js";
import { boardController } from "../controllers/boardController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
const boardRouter = express.Router();
boardRouter
  .route("/")
  .post(boardValidation.createNew, boardController.createNew);
boardRouter
  .route("/:id")
  .get(AuthMiddleware.isAuthorized, boardController.getBoardDetail)
  .put(boardValidation.updateColumn, boardController.updateColumnOrderIds);
export default boardRouter;
