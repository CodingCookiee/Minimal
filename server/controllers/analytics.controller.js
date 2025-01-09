import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import createError from "../utils/createError.utils.js";

export const getAnalyticsData = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
          totalItems: { $sum: { $size: "$products" } },
        },
      },
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          totalSold: { $sum: "$products.quantity" },
          revenue: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    const { totalSales, averageOrderValue, totalItems } = salesData[0] || {
      totalSales: 0,
      averageOrderValue: 0,
      totalItems: 0,
    };

    res.status(200).json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalSales,
      averageOrderValue,
      totalItems,
      topProducts,
    });
  } catch (err) {
    next(createError(500, "Error fetching analytics data"));
  }
};

export const getDailySalesData = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dates = getDatesInRange(start, end);
    const formattedData = dates.map((date) => {
      const formattedDate = date.toISOString().split("T")[0];
      const data = dailySalesData.find((item) => item._id === formattedDate);
      return {
        date: formattedDate,
        totalSales: data?.totalSales || 0,
        orderCount: data?.orderCount || 0,
        averageOrderValue: data?.averageOrderValue || 0,
      };
    });

    res.status(200).json(formattedData);
  } catch (err) {
    next(createError(500, "Error fetching daily sales data"));
  }
};

const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
