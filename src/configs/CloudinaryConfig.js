import { v2 as cloudinaryConfig } from "cloudinary";
import { environmentConfig } from "./EnvConfig.js";
// Cấu hình Cloudinary
cloudinaryConfig.config({
  cloud_name: environmentConfig.CLOUDINARY_CLOUD_NAME,
  api_key: environmentConfig.CLOUDINARY_API_KEY,
  api_secret: environmentConfig.CLOUDINARY_API_SECRET,
});
export default cloudinaryConfig;
