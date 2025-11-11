import express from "express";
import boardRouter from "./boardRoute.js";
import columnRouter from "./columnRouter.js";
import cardRouter from "./cardRoute.js";
const router = express.Router();

router.use("/boards", boardRouter);
router.use("/columns", columnRouter);
router.use("/cards", cardRouter);

export const API_Router = router;
