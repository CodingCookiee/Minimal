import express from "express";
import {
  authenticateAdmin,
  authenticateUser,
} from "../middleware/auth.middleware.js";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", authenticateUser, authenticateAdmin, getAnalyticsData);
router.get("/daily", authenticateUser, authenticateAdmin, getDailySalesData);

export default router;
