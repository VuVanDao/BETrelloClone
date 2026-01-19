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
router.use("/board_recent_views", boardRecentViewRouter);
router.use("/pinned_boards", pinnedBoardRouter);
router.use("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

export const API_Router = router;
