import express from "express";
import boardRouter from "./boardRoute.js";
import columnRouter from "./columnRouter.js";
import cardRouter from "./cardRoute.js";
import AccountRouter from "./accountRouter.js";
import boardRecentViewRouter from "./boardRecentViewRouter.js";
import pinnedBoardRouter from "./pinnedBoardRouter.js";
const router = express.Router();

router.use("/boards", boardRouter);
router.use("/columns", columnRouter);
router.use("/cards", cardRouter);
router.use("/accounts", AccountRouter);
router.use("/pinned_boards", pinnedBoardRouter);
router.use("/recently_viewed_board", boardRecentViewRouter);

export const API_Router = router;
