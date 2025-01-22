/* eslint-disable prettier/prettier */
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import createError from "../utils/createError.utils.js";

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      subtitle,
      description,
      price,
      discountedPrice,
      discountPercentage,
      category,
      images,
      stock,
      gender,
      colors,
      sizes,
    } = req.body;

    // Input validation
    if (!name || !description || !price || !category || !stock || !gender) {
      throw createError(400, "Missing required fields");
    }

    // Price validation
    if (price <= 0 || (discountedPrice && discountedPrice <= 0)) {
      throw createError(400, "Invalid price values");
    }

    // Calculate discount percentage if not provided
    let calculatedDiscountPercentage = discountPercentage;
    if (discountedPrice && !discountPercentage) {
      calculatedDiscountPercentage = Math.round(
        ((price - discountedPrice) / price) * 100,
      );
    }

    // Validate colors array
    if (!Array.isArray(colors)) {
      throw createError(400, "Colors must be an array");
    }

    let mainImage = "";
    let imageUrls = [];

    if (images && images.length > 0) {
      try {
        // Sort images before upload
        const sortedImages = [...images].sort((a, b) => {
          const isProdA =
            a.originalName.includes("prod") ||
            a.originalName.includes("main") ||
            a.originalName.includes("front");
          const isProdB =
            b.originalName.includes("prod") ||
            b.originalName.includes("main") ||
            b.originalName.includes("front");
          return isProdB - isProdA;
        });

        // Upload to Cloudinary with original filenames
        const uploadPromises = sortedImages.map((image) =>
          cloudinary.uploader.upload(image.data, {
            upload_preset: "minimal",
            timeout: 120000,
            public_id: image.originalName.split(".")[0], // Use original filename without extension
            filename_override: image.originalName, // Preserve original filename
          }),
        );

        const cloudinaryResponses = await Promise.all(uploadPromises);
        console.log("Total images uploaded:", cloudinaryResponses.length);

        imageUrls = cloudinaryResponses.map((response) => response.secure_url);
        mainImage = imageUrls[0];
      } catch (cloudinaryError) {
        console.error("Cloudinary Upload Error:", cloudinaryError);
        throw createError(500, "Image upload failed");
      }
    }

    // Create product with all fields
    const product = new Product({
      name,
      subtitle,
      description,
      price,
      discountedPrice: discountedPrice || price,
      discountPercentage: calculatedDiscountPercentage || 0,
      category,
      image: mainImage,
      imagePath: imageUrls,
      stock,
      gender,
      colors: colors || [],
      sizes: sizes || [],
      rating: 0,
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (err) {
    console.error("Error Creating Product:", {
      message: err.message,
      stack: err.stack,
    });
    next(
      err.status
        ? err
        : createError(500, `Product creation failed: ${err.message}`),
    );
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

export const getSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return next(createError(404, "Product not found"));
    }
    res.json(product);
  } catch (err) {
    console.error("Error Fetching Product", err.message);
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

export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    // Enhanced search query to match across all fields and categories
    const searchQuery = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { subtitle: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    };

    const products = await Product.find(searchQuery).select(
      "name subtitle price image category",
    );

    res.json(products);
  } catch (err) {
    console.log("Error Searching Products", err.message);
    next(createError(500, "Error searching products"));
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
