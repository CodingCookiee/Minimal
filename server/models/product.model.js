import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    discountPercentage: { type: String },
    image: { type: String, required: true },
    imagePath: [{ type: String }],
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    gender: { type: String, required: true },
    colors: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, required: true },
    cloudinaryFolder: { type: String }, 
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        rating: Number,
      },
    ],
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
