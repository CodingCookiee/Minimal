/* eslint-disable prettier/prettier */
import Order from "../models/order.model.js";

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log("Error Fectching Orders:", error.message);
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("items.productId");
    res.json(order);
  } catch (error) {
    next(error);
  }
};
