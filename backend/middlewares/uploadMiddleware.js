import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "watches",
    allowed_formats: ["jpg", "jpeg", "png","webp"], // 👈 spelling fixed
  },
});

const upload = multer({ storage });

// 👇 IMPORTANT EXPORT
export const uploadImages = upload.array("images", 5);

export default upload;
