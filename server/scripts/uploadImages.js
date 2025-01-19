/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import dotenv from "dotenv";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import { menCategories } from "../../client/src/constants/menCategories.js";
import { womenCategories } from "../../client/src/constants/womenCategories.js";
import { saleCategories } from "../../client/src/constants/saleCategories.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const categoryData = {
  men: menCategories,
  women: womenCategories,
  sale: saleCategories,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const uploadWithRetry = async (
  imagePath,
  folderPath,
  fileName,
  retries = 0,
) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: folderPath,
      public_id: fileName,
      overwrite: true,
      resource_type: "auto",
      timeout: 60000,
    });
    return result.secure_url;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(`Retry attempt ${retries + 1} for ${imagePath}`);
      await sleep(RETRY_DELAY);
      return uploadWithRetry(imagePath, folderPath, fileName, retries + 1);
    }
    throw error;
  }
};

const uploadImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const [mainCategory, categories] of Object.entries(categoryData)) {
      for (const [subCategory, products] of Object.entries(categories)) {
        for (const product of products) {
          console.log(
            `\nProcessing: ${mainCategory} - ${subCategory} - ${product.title}`,
          );

          const uploadedImages = [];
          for (const [index, imgPath] of product.imagePath.entries()) {
            const cleanPath = imgPath.startsWith("/")
              ? imgPath.slice(1)
              : imgPath;
            const imagePath = path.join(
              __dirname,
              "../../client/public",
              cleanPath,
            );
            const folderPath = `minimal/${mainCategory}/${subCategory}/${product.title.replace(/\s+/g, "_")}`;
            const fileName = `image_${index + 1}`;

            try {
              const uploadedUrl = await uploadWithRetry(
                imagePath,
                folderPath,
                fileName,
              );
              uploadedImages.push(uploadedUrl);
              console.log(`Success: ${uploadedUrl}`);
            } catch (error) {
              console.error(`Failed to upload ${imagePath}`);
            }
          }

          if (uploadedImages.length > 0) {
            await Product.findOneAndUpdate(
              { name: product.title },
              {
                imagePath: uploadedImages,
                image: uploadedImages[0],
              },
              { new: true },
            );
          }
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
