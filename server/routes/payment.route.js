import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  createPaymentIntent,
  handlePaymentSuccess
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-payment-intent", authenticateUser, createPaymentIntent);
router.post("/payment-success", authenticateUser, handlePaymentSuccess);

export default router;
