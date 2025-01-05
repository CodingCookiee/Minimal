import mongoose from "mongoose";

// Create a compound index for code and userId together
const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add compound index
couponSchema.index({ code: 1, userId: 1 }, { unique: true });

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
