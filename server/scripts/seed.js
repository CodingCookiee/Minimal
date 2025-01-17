import mongoose from "mongoose";
import dotenv from "dotenv";
import { menCategories } from "../../client/src/constants/menCategories.js";
import { womenCategories } from "../../client/src/constants/womenCategories.js";
import { saleCategories } from "../../client/src/constants/saleCategories.js";
import Product from "../models/product.model.js";

dotenv.config();

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/codepanda/image/upload/v1/minimal";

const createProductDocument = async (product, category, type) => {
  // Convert local paths to Cloudinary URLs
  const cloudinaryImages = product.imagePath.map(path => {
    const cleanPath = path.replace(/^\//, '').replace(/\.[^/.]+$/, '');
    return `${CLOUDINARY_BASE_URL}/${cleanPath}`;
  });

  const productData = {
    name: product.title,
    description: product.description,
    price: parseFloat(product.price.replace("$", "")),
    category: `${type}_${category}`,
    image: cloudinaryImages[0],
    imagePath: cloudinaryImages,
    stock: 100,
    rating: 4.5,
    subtitle: product.subtitle,
    gender: product.gender,
    colors: product.colors
  };

  if (product.discountedPrice) {
    productData.discountedPrice = parseFloat(product.discountedPrice.replace("$", ""));
    productData.discountPercentage = parseInt(product.discountPercentage);
  }

  return await Product.create(productData);
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Seed men's products
    for (const [category, products] of Object.entries(menCategories)) {
      for (const product of products) {
        await createProductDocument(product, category, "men");
      }
    }

    // Seed women's products
    for (const [category, products] of Object.entries(womenCategories)) {
      for (const product of products) {
        await createProductDocument(product, category, "women");
      }
    }

    // Seed sale products
    for (const [category, products] of Object.entries(saleCategories)) {
      for (const product of products) {
        await createProductDocument(product, category, "sale");
      }
    }

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
