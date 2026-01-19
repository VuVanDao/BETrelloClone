import express from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import { pinnedBoardValidation } from "../validations/pinnedBoardValidation.js";
import { pinnedBoardController } from "../controllers/pinnedBoardController.js";

const pinnedBoardRouter = express.Router();
pinnedBoardRouter
  .route("/add_to_pinned_board")
  .post(
    AuthMiddleware.isAuthorized,
    pinnedBoardValidation.createNew,
    pinnedBoardController.createNew,
  );
pinnedBoardRouter
  .route("/remove_to_pinned_board")
  .post(AuthMiddleware.isAuthorized, pinnedBoardController.removePinnedBoard);
// .get(AuthMiddleware.isAuthorized, boardController.getBoardDetail)
// .put(boardValidation.updateColumn, boardController.updateColumnOrderIds);
pinnedBoardRouter
  .route("/")
  .get(AuthMiddleware.isAuthorized, pinnedBoardController.getAllPinnedBoard);
export default pinnedBoardRouter;
