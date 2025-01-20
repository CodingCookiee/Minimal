import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import createError from "../utils/createError.utils.js";
import Cart from "../models/cart.model.js";
import stripe from "../lib/stripe.js";
import User from "../models/user.model.js";

export const createCheckoutSession = async (req, res, next) => {
  try {
    const { couponCode } = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      throw createError(400, "No products in the cart");
    }

    let totalAmount = cart.items.reduce((acc, item) => {
      const itemPrice = item.productId.discountedPrice || item.productId.price;
      return acc + itemPrice * item.quantity;
    }, 0);

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, userId });
      if (coupon && coupon.isActive) {
        const discount = (coupon.discountPercentage / 100) * totalAmount;
        totalAmount -= discount;
      }
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      line_items: cart.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productId.name,
            images: [item.productId.image],
            metadata: {
              productId: item.productId._id.toString(),
            },
          },

          unit_amount: Math.round(
            (item.productId.discountedPrice || item.productId.price) * 100,
          ),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      return_url: `${process.env.CLIENT_URL}/payment/return?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: userId.toString(),
        couponCode: couponCode || "",
        originalAmount: cart.totalAmount,
        discountedAmount: totalAmount,
      },
    });

    res.status(200).json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error) {
    next(error);
  }
};

export const checkoutSuccess = async (req, res, next) => {
  try {
    const { session_id } = req.body;

    const existingOrder = await Order.findOne({ stripeSessionId: session_id });
    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already processed",
        order: existingOrder,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const { userId } = session.metadata;

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    // Get cart to map product IDs
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      const errorMessage = `Cart not found for userId: ${userId}`;
      console.error(errorMessage);
      throw createError(404, errorMessage);
    }

    const newOrder = new Order({
      userId,
      products: cart?.items?.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.discountedPrice || item.productId.price,
      })),
      totalAmount: session.amount_total / 100,
      stripeSessionId: session.id,
      shippingAddress: user.addresses[0]?.address1 || "Default Address",
      paymentMethod: session.payment_method_types[0],
      paymentStatus: "paid",
      processed: true,
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Checkout Success Error:", error.message);
    next(error);
  }
};
