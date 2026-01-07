import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected Profile Route

userRouter.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

export default userRouter;
