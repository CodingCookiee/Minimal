import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    isActive: {
        type: Boolean,
        default: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true

    }
},
{
    timestamps: true
}
);
export const Coupon = mongoose.model('Coupon', couponSchema);
