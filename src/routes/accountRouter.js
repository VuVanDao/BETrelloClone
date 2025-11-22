import express from "express";
import { accountValidation } from "../validations/accountValidation.js";
import { accountController } from "../controllers/accountController.js";
import verifyAuth0Token from "../middlewares/VerifyAuth0.js";
const AccountRouter = express.Router();
AccountRouter.route("/create_account").post(
  verifyAuth0Token,
  accountValidation.createNew,
  accountController.createNew
);
export default AccountRouter;
