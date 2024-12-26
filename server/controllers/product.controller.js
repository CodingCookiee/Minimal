import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import createError from "../utils/createError.js";

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "minimal",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      stock,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error Creating Product", err.message);
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
    res.status(204).end();
  } catch (err) {
    console.error("Error Deleting Product", err.message);
    next(createError(500, "Internal Server Error"));
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

    const featuredProducts = await Product.find({ featured: true });
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

    product.featured = !product.featured;
    await product.save();
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
