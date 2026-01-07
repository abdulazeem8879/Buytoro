import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import upload from "../middlewares/uploadMiddleware.js";
import { protect, admin } from "../middlewares/authMiddleware.js"; // ✅ ADD

const productRouter = express.Router();

// PUBLIC ROUTES
productRouter.route("/").get(getAllProducts);

// ADMIN ONLY (CREATE PRODUCT)
productRouter.route("/").post(
  protect, // 👈 login required
  admin, // 👈 admin required
  upload.single("image"),
  createProduct
);

//  PUBLIC
productRouter.route("/:id").get(getProductById);

// ADMIN ONLY (UPDATE + DELETE)
productRouter
  .route("/:id")
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);

export default productRouter;
