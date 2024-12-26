import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../controllers/checkout.controller.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  authenticateUser,
  createCheckoutSession,
);
router.post("/checkout-success", authenticateUser, checkoutSuccess);

export default router;
