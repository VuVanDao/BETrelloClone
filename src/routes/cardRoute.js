import express from "express";
import { StatusCodes } from "http-status-codes";
import { cardValidation } from "../validations/cardValidation.js";
import { cardController } from "../controllers/cardController.js";
const cardRouter = express.Router();
cardRouter.route("/").post(cardValidation.createNew, cardController.createNew);

export default cardRouter;
