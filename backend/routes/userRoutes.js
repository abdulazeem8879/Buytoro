import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  getWishlist,
  toggleWishlist,
  verifyOtp,
  resendOtp,
  sendContactMessage,
  deleteAccount,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../controllers/userController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";
import { uploadProfileImage } from "../middlewares/uploadMiddleware.js";

const userRouter = express.Router();

/* ===========================
      AUTH
      =========================== */
userRouter.post("/register", registerUser);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/resend-otp", resendOtp);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-reset-otp", verifyResetOtp);
userRouter.post("/reset-password", resetPassword);

/* ===========================
      PROFILE
      =========================== */

// GET logged-in user profile
userRouter.get("/profile", protect, getUserProfile);
userRouter.delete("/profile", protect, deleteAccount);

userRouter.post("/contact", protect, sendContactMessage);

// UPDATE profile (name + profile image)
userRouter.put("/profile", protect, uploadProfileImage, updateUserProfile);

// CHANGE PASSWORD
userRouter.put("/change-password", protect, changePassword);

userRouter.post("/wishlist/:productId", protect, toggleWishlist);
userRouter.get("/wishlist", protect, getWishlist);

/* ===========================
      ADMIN
      =========================== */

// GET all users (ADMIN ONLY)
userRouter.get("/", protect, admin, getAllUsers);

export default userRouter;
