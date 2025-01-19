import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import createError from "../utils/createError.utils.js";
import Cart from "../models/cart.model.js";
import stripe from "../lib/stripe.js";
import User from "../models/user.model.js";



export const createPaymentIntent = async (req, res, next) => {
  try {
    const { items, couponCode, addressId } = req.body;
    const userId = req.user._id;
    let amount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, userId });
      if (coupon && coupon.isActive) {
        const discount = (coupon.discountPercentage / 100) * amount;
        amount -= discount;
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        userId: userId.toString(),
        addressId: addressId,
        couponCode: couponCode || '',
        originalAmount: amount,
        discountedAmount: amount
      },
      automatic_payment_methods: {
        enabled: true,
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: amount
    });
  } catch (error) {
    console.error("Error creating payment intent", error.message);
    next(error);
  }
};

export const handlePaymentSuccess = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const userId = paymentIntent.metadata.userId;
    const addressId = paymentIntent.metadata.addressId;

    // Get cart and user data
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    const user = await User.findById(userId);
    
    // Find selected address from user's addresses
    const selectedAddress = user.addresses.find(addr => addr._id.toString() === addressId);

    const order = new Order({
      userId,
      products: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: paymentIntent.amount / 100,
      stripeSessionId: paymentIntent.id,
      shippingAddress: `${selectedAddress.name}, ${selectedAddress.address1}, ${selectedAddress.city}, ${selectedAddress.country} ${selectedAddress.postalCode}`,
      paymentMethod: 'card',
      paymentStatus: 'paid',
    });

    await order.save();
    await Cart.findOneAndDelete({ userId });

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};


