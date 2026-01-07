import jwt from "jsonwebtoken";
import user from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;
  

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.toLowerCase().startsWith("bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //  User attach without password

      req.user = await user.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin middleware

export const admin = (req, res, next) => {
  // console.log("ADMIN CHECK USER:", req.user);
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({ message: "Not authorized as an admin" });
  }
};
