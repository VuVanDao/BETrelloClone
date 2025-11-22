import { auth } from "express-oauth2-jwt-bearer";
import { environmentConfig } from "../configs/EnvConfig.js";

// Hàm này sẽ tự động check token của Auth0 xem có đúng audience và issuer không
const verifyAuth0Token = auth({
  audience: environmentConfig.AUTH0_AUDIENCE, // Ví dụ: https://trello-clone-api
  issuerBaseURL: environmentConfig.DOMAIN_AUTH0, // Domain Auth0 của bạn
  tokenSigningAlg: "RS256",
});
export default verifyAuth0Token;
