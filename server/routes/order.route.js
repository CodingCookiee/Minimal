import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  getOrderById,
  getUserOrders,
} from "../controllers/order.controller.js";


const router = express.Router();



router.get("/", authenticateUser, getUserOrders);
router.get("/:id", authenticateUser, getOrderById);

export default router;
