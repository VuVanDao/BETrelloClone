import cloudinaryConfig from "../configs/CloudinaryConfig.js";
import streamifier from "streamifier"; // chuyển Buffer thành Stream.

const uploadToCloudinary = async (req, clientPublic_id = null) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: "auto",
      };
      if (clientPublic_id) {
        uploadOptions.public_id = clientPublic_id; // Dùng lại ID cũ
        uploadOptions.overwrite = true; // Cho phép ghi đè
        uploadOptions.invalidate = true; // Xóa cache CDN cũ
      } else {
        uploadOptions.folder = "trelloCloneBE";
      }
      const stream = cloudinaryConfig.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      // Chuyển buffer thành luồng (stream) để gửi lên Cloudinary
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  } catch (error) {
    throw new Error(error);
  }
};
export const CloudinaryHelper = {
  uploadToCloudinary,
};
