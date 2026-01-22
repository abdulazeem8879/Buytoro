import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/* ===========================
   PRODUCT MEDIA STORAGE
   (Images + Video)
   =========================== */
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "buytoro/products",
    resource_type: "auto", // 🔥 IMPORTANT: image + video both
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "webm"],
  },
});

const uploadProduct = multer({
  storage: productStorage,
});

// ✅ PRODUCT: multiple images + single video
export const uploadProductMedia = uploadProduct.fields([
  { name: "images", maxCount: 6 },
  { name: "productVideo", maxCount: 1 },
]);

/* ===========================
   PROFILE IMAGE STORAGE
   (Image only)
   =========================== */
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "buytoro/profile",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadProfile = multer({
  storage: profileStorage,
});

// ✅ PROFILE: single image
export const uploadProfileImage = uploadProfile.single("profileImage");
