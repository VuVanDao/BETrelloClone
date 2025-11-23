import express from "express";
import { accountValidation } from "../validations/accountValidation.js";
import { accountController } from "../controllers/accountController.js";
import verifyAuth0Token from "../middlewares/VerifyAuth0.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
const AccountRouter = express.Router();
AccountRouter.route("/create_account").post(
  verifyAuth0Token,
  accountValidation.createNew,
  accountController.createNew
);
AccountRouter.route("/:id")
  .get(accountController.findOneByAuth0IdOrEmail)
  .put(AuthMiddleware.isAuthorized, accountController.UpdateAccount);
AccountRouter.route("/login").post(accountController.Login);
export default AccountRouter;
