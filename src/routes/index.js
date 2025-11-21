import express from "express";
import boardRouter from "./boardRoute.js";
import columnRouter from "./columnRouter.js";
import cardRouter from "./cardRoute.js";
import AccountRouter from "./accountRouter.js";
const router = express.Router();

router.use("/boards", boardRouter);
router.use("/columns", columnRouter);
router.use("/cards", cardRouter);
router.use("/accounts", AccountRouter);

export const API_Router = router;
