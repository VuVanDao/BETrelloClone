// lí do cần multer: https://chatgpt.com/c/69248668-e588-8321-8f78-dc2d994df062

// Cấu hình Storage cho Multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "trelloCloneBE", // Tên thư mục trên Cloudinary
//     allowed_formats: ["jpg", "png", "jpeg"], // Các định dạng cho phép
//     // transformation: [{ width: 500, height: 500, crop: 'limit' }], // (Tùy chọn) Resize ảnh ngay khi upload
//   },
// });
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 5 * 1024 * 1024, //5mb
  },
});
export default upload;
