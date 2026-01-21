import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/userController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";
import { uploadProfileImage } from "../middlewares/uploadMiddleware.js";

const userRouter = express.Router();

/* ===========================
   AUTH
   =========================== */
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

/* ===========================
   PROFILE
   =========================== */

// GET logged-in user profile
userRouter.get("/profile", protect, getUserProfile);

// UPDATE profile (name + profile image)
userRouter.put(
  "/profile",
  protect,
  uploadProfileImage,
  updateUserProfile
);

// CHANGE PASSWORD
userRouter.put(
  "/change-password",
  protect,
  changePassword
);

/* ===========================
   (Future) ADMIN ROUTES
   =========================== */
// example:
// userRouter.get("/admin/users", protect, admin, getAllUsers);

export default userRouter;
