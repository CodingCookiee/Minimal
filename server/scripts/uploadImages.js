/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import dotenv from "dotenv";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { menCategories } from '../../client/src/constants/menCategories.js';
import { womenCategories } from '../../client/src/constants/womenCategories.js';
import { saleCategories } from '../../client/src/constants/saleCategories.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const categoryData = {
      men: menCategories,
      women: womenCategories,
      sale: saleCategories
    };

    for (const [mainCategory, categories] of Object.entries(categoryData)) {
      for (const [subCategory, products] of Object.entries(categories)) {
        for (const product of products) {
          console.log(`\nProcessing: ${mainCategory} - ${subCategory} - ${product.title}`);
          
          const imagePaths = product.imagePath.map(imgPath => {
            const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
            return path.join(__dirname, '../../client/public', cleanPath);
          });

          const uploadedImages = await Promise.all(
            imagePaths.map(async (imagePath, index) => {
              const folderPath = `minimal/${mainCategory}/${subCategory}/${product.title.replace(/\s+/g, '_')}`;
              const fileName = `image_${index + 1}`;

              console.log(`Uploading: ${imagePath}`);
              console.log(`To folder: ${folderPath}`);

              const result = await cloudinary.uploader.upload(imagePath, {
                folder: folderPath,
                public_id: fileName,
                overwrite: true,
                resource_type: "auto"
              });

              console.log(`Success: ${result.secure_url}`);
              return result.secure_url;
            })
          );

          await Product.findOneAndUpdate(
            { name: product.title },
            {
              imagePath: uploadedImages,
              image: uploadedImages[0]
            },
            { new: true }
          );
        }
      }
    }

    console.log("\nUpload completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Upload error:", error);
    process.exit(1);
  }
};

uploadImages();
