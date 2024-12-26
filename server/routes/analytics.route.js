import express from "express";
import createError from "../utils/createError";
import {
  authenticateAdmin,
  authenticateUser,
} from "../middleware/auth.middleware.js";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", authenticateUser, authenticateAdmin, async (req, res, next) => {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.log("Error fetching analytics data", error.message);
    next(createError(500, "Internal Server Error"));
  }
});

export default router;
