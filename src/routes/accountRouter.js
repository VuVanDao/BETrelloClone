import express from "express";
import { accountValidation } from "../validations/accountValidation.js";
import { accountController } from "../controllers/accountController.js";
import verifyAuth0Token from "../middlewares/VerifyAuth0.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import upload from "../configs/MulterConfig.js";
const AccountRouter = express.Router();
AccountRouter.route("/create_account").post(
  verifyAuth0Token,
  accountValidation.createNew,
  accountController.createNew
);
AccountRouter.route("/login").post(verifyAuth0Token, accountController.Login);
AccountRouter.route("/logout").get(accountController.logout);
AccountRouter.route("/refresh_token").get(accountController.refreshToken);
AccountRouter.route("/upload_avatar").put(
  upload.single("image"),
  accountController.upload_avatar
);
AccountRouter.route("/:id")
  .get(accountController.findOneByAuth0IdOrEmail)
  .put(AuthMiddleware.isAuthorized, accountController.UpdateAccount);
export default AccountRouter;
