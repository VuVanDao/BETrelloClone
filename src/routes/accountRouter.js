import express from "express";
import { accountValidation } from "../validations/accountValidation.js";
import { accountController } from "../controllers/accountController.js";
const AccountRouter = express.Router();
AccountRouter.route("/create_account").post(
  accountValidation.createNew,
  accountController.createNew
);
export default AccountRouter;
