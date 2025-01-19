/* eslint-disable prettier/prettier */
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import createError from "../utils/createError.utils.js";

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "minimal",
        timeout: 60000, // 60 seconds timeout
      });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image: cloudinaryResponse?.secure_url || "",
      stock,
      rating: 4.5,
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error Creating Product:", {
      message: err.message,
      stack: err.stack,
    });
    next(createError(500, `Product creation failed: ${err.message}`));
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error Fetching Products", err.message);
    next(createError(500, "Internal Server Error"));
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await redis.get("featuredProducts");

    if (products) {
      return res.json(JSON.parse(products));
    }

    const featuredProducts = await Product.find({ isFeatured: true });
    redis.set("featuredProducts", JSON.stringify(featuredProducts), "EX", 60);
    res.json(featuredProducts);
  } catch (err) {
    console.error("Error Fetching Featured Products", err.message);
    next(createError(500, "Internal Server Error"));
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });

    if (!products.length) {
      return next(createError(404, "No Products found in this category"));
    }
    res.json(products);
  } catch (err) {
    console.error("Error Fetching Products by Category", err.message);
    next(createError(500, "Internal Server Error"));
  }
};

export const getRecommendedProducts = async (req, res, next) => {
  try {
    const products = await redis.get("recommendedProducts");

    if (products) {
      return res.json(JSON.parse(products));
    }

    const recommendedProducts = await Product.find({ rating: { $gte: 4 } });
    redis.set(
      "recommendedProducts",
      JSON.stringify(recommendedProducts),
      "EX",
      60,
    );
    res.json(recommendedProducts);
  } catch (err) {
    console.error("Error Fetching Recommended Products", err.message);
    next(createError(500, "Internal Server Error"));
  }
};

export const toggleFeaturedProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return next(createError(404, "Product not found"));
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    // Send response immediately after toggle
    res.status(200).json(updatedProduct);

    // Update cache in background
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set(
      "featuredProducts",
      JSON.stringify(featuredProducts),
      "EX",
      60,
    );
  } catch (err) {
    console.error("Error Toggling Featured Product", err.message);
    next(createError(500, "Internal Server Error"));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return next(createError(404, "Product not found"));
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
      console.log("Image Deleted from Cloudinary");
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error Deleting Product", err.message);
    next(createError(500, "Internal Server Error"));
  }
};

export const getProductsByTypeAndCategory = async (req, res, next) => {
  try {
    const { type, category } = req.params;
    const searchCategory = category ? `${type}_${category}` : type;
    const products = await Product.find({ category: searchCategory });

    const transformedProducts = products.map((product) => {
      const productObj = product.toObject();

      return productObj;
    });

    res.json(transformedProducts);
  } catch (err) {
    next(createError(500, "Error fetching products"));
  }
};
