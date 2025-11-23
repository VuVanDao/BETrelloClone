import JWT from "jsonwebtoken";
const generateToken = async (userInfo, secretSignature, timeLifeToken) => {
  try {
    return JWT.sign(userInfo, secretSignature, {
      algorithm: "HS256",
      expiresIn: timeLifeToken,
    });
  } catch (error) {
    throw new Error(error);
  }
};
const verifyToken = async (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature);
  } catch (error) {
    throw new Error(error);
  }
};
export { generateToken, verifyToken };
