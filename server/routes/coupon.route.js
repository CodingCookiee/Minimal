import express from "express";
import { authenticateUser, authenticateAdmin } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon, createCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", authenticateUser, getCoupon);
router.post("/", authenticateUser, validateCoupon);
router.post("/create", authenticateUser, authenticateAdmin, createCoupon);


export default router;
