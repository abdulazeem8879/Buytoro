import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const orderRouter = express.Router();

// user order routes
orderRouter.post("/", protect, createOrder);
orderRouter.get("/myorders", protect, getMyOrders);
orderRouter.get("/:id", protect, getOrderById);
orderRouter.put('/:id/pay', protect, updateOrderToPaid);

// Admin order routes

orderRouter.get("/", protect, admin, getAllOrders);
orderRouter.put('/:id/deliver', protect, admin, updateOrderToDelivered);

export default orderRouter;