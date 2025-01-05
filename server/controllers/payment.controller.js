import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import createError from "../utils/createError.js";
import Cart from "../models/cart.model.js";
import stripe from "../lib/stripe.js";

export const createCheckoutSession = async (req, res, next) => {
    try {
        const { couponCode } = req.body;
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        
        if (!cart || cart.items.length === 0) {
            throw createError(400, "No products in the cart");
        }

        let totalAmount = cart.totalAmount;

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode, userId });
            if (coupon && coupon.isActive) {
                const discount = (coupon.discountPercentage / 100) * totalAmount;
                totalAmount -= discount;
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: cart.items.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.productId.name,
                        images: [item.productId.image],
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            metadata: {
                userId: userId.toString(),
                couponCode: couponCode || '',
                originalAmount: cart.totalAmount,
                discountedAmount: totalAmount
            },
        });

        res.status(200).json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        next(error);
    }
}



export const checkoutSuccess = async (req, res, next) => {
    try {
        const { session_id } = req.body;
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['line_items', 'line_items.data.price.product']
        });
        
        const { userId, couponCode } = session.metadata;
        const cart = await Cart.findOne({ userId });

        const order = new Order({
            userId,
            products: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: session.amount_total / 100,
            stripeSessionId: session.id,
            shippingAddress: session.shipping?.address?.line1 || "Default Address", // Add default or required shipping address
            paymentMethod: session.payment_method_types[0],
            paymentStatus: 'paid'
        });

        if(couponCode) {
            order.couponCode = couponCode;
        }

        await order.save();
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.error('Error Creating Order:', error);
        next(error);
    }
}

