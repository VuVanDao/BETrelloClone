import express from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import { boardRecentViewValidation } from "../validations/boardRecentViewValidation.js";
import { boardRecentViewController } from "../controllers/boardRecentViewController.js";
const boardRecentViewRouter = express.Router();
boardRecentViewRouter
  .route("/add_to_recent_view")
  .post(
    AuthMiddleware.isAuthorized,
    boardRecentViewValidation.createNew,
    boardRecentViewController.createNew,
  );
boardRecentViewRouter
  .route("/:accountId")
  .get(
    AuthMiddleware.isAuthorized,
    boardRecentViewController.getRecentlyViewedBoard,
  );
export default boardRecentViewRouter;
