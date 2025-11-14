import express from "express";
import { StatusCodes } from "http-status-codes";
import { columnValidation } from "../validations/columnValidation.js";
import { columnController } from "../controllers/columnController.js";
const columnRouter = express.Router();
columnRouter
  .route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "column" });
  })
  .post(columnValidation.createNew, columnController.createNew);

export default columnRouter;
