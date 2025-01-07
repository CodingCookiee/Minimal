import Coupon from "../models/coupon.model.js";
import createError from "../utils/createError.utils.js";

export const getCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({ userId: req.user.id, isActive: true });
    if (!coupon) {
      return next(createError(404, "Coupon not found")); 
    }
    res.status(200).json(coupon || null);
  } catch (err) {
    next(err);
  }
};


export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code, userId: req.user.id });
    if (!coupon) {
      return next(createError(404, "Coupon not found"));
    }
    if (coupon.expirationDate < new Date()) {
        coupon.isActive = false;
        await coupon.save();
      return next(createError(400, "Coupon has expired"));
    }
    if (!coupon.isActive) {
      return next(createError(400, "Coupon is not active"));
    }
    res.status(200).json({
        message: "Coupon is valid",
        code: coupon.code,
        discountPercentage: coupon.discountPercentage
     });
  } catch (err) {
    next(err);
  }
};

export const createCoupon = async (req, res, next) => {
    try {
        const { code, expirationDate, discountPercentage, userId } = req.body;
        
        // Check if target user already has a coupon
        const existingCoupon = await Coupon.findOne({ userId });
        if (existingCoupon) {
            return next(createError(400, "User already has an active coupon"));
        }

        const coupon = new Coupon({
            code,
            expirationDate,
            discountPercentage,
            userId: userId || req.user.id, // Use provided userId or default to admin
            isActive: true
        });

        if(coupon.expirationDate < new Date()) {
            return next(createError(400, "Expiration date must be in the future"));
        }
        
        if(coupon.discountPercentage < 0 || coupon.discountPercentage > 100) {
            return next(createError(400, "Discount percentage must be between 0 and 100"));
        }
        
    
        const savedCoupon = await coupon.save();
        res.status(201).json(savedCoupon);
    } catch (err) {
        next(createError(500, `Coupon creation failed: ${err.message}`));
    }
};

