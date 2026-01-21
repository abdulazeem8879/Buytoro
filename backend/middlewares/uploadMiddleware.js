import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/* ===========================
   PRODUCT MEDIA STORAGE
   =========================== */
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "buytoro/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "webm"],
  },
});

const uploadProduct = multer({ storage: productStorage });

// ✅ PRODUCT: images + video
export const uploadProductMedia = uploadProduct.fields([
  { name: "images", maxCount: 6 },
  { name: "productVideo", maxCount: 1 },
]);

/* ===========================
   PROFILE IMAGE STORAGE
   =========================== */
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "buytoro/profile", // 🔥 NEW FOLDER
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadProfile = multer({ storage: profileStorage });

// ✅ PROFILE: single image
export const uploadProfileImage = uploadProfile.single(
  "profileImage"
);
