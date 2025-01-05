import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  addToCart,
  getCartItems,
  removeCartItems,
  updateQuantity,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", authenticateUser, addToCart);
router.get("/", authenticateUser, getCartItems);
router.put("/:id", authenticateUser, updateQuantity);
router.delete("/:id", authenticateUser, removeCartItems);

export default router;
