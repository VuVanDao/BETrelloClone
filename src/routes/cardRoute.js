import express from "express";
import { cardValidation } from "../validations/cardValidation.js";
import { cardController } from "../controllers/cardController.js";
const cardRouter = express.Router();
cardRouter.route("/").post(cardValidation.createNew, cardController.createNew);
cardRouter.route("/:cardId").put(cardController.UpdateOneById);

export default cardRouter;
