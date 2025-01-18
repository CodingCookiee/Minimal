/* eslint-disable prettier/prettier */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { menCategories } from "../../client/src/constants/menCategories.js";
import { womenCategories } from "../../client/src/constants/womenCategories.js";
import { saleCategories } from "../../client/src/constants/saleCategories.js";
import Product from "../models/product.model.js";

dotenv.config();

const createProductDocument = async (product, category, type) => {
   // Get the exact folder name from your local structure
   const productFolderName = product.imagePath[0].split('/').slice(-2)[0]; // Gets the full folder name like 'Baggy_Jeans_-_Dark_denim_grey'
   const folderPath = `minimal/${type}/${category}/${productFolderName}`;
   
   const cloudinaryImages = product.imagePath.map(originalPath => {
     const fileName = originalPath.split('/').pop();
     return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${folderPath}/${fileName}`;
   });

  // Sort images to put hmgoepprod or prod first
  const sortedImages = [...cloudinaryImages].sort((a, b) => {
    const isProdA = a.includes('hmgoepprod') || a.includes('prod');
    const isProdB = b.includes('hmgoepprod') || b.includes('prod');
    return isProdB - isProdA;
  });

  const productData = {
    name: product.title,
    description: product.description,
    price: parseFloat(product.price.replace("$", "")),
    category: `${type}_${category}`,
    image: sortedImages[0], 
    imagePath: sortedImages,
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
    console.log("\n🔌 Connected to MongoDB");

    const existingCount = await Product.countDocuments();
    await Product.deleteMany({});
    console.log(`\n🧹 Cleared ${existingCount} existing products from database`);

    // Seed men's products
    for (const [category, products] of Object.entries(menCategories)) {
      console.log(`\n📦 Seeding men's ${category}...`);
      for (const product of products) {
        const newProduct = await createProductDocument(product, category, "men");
        console.log(`✅ Created: ${newProduct.name}`);
      }
    }

    // Seed women's products
    for (const [category, products] of Object.entries(womenCategories)) {
      console.log(`\n📦 Seeding women's ${category}...`);
      for (const product of products) {
        const newProduct = await createProductDocument(product, category, "women");
        console.log(`✅ Created: ${newProduct.name}`);
      }
    }

    // Seed sale products
    for (const [category, products] of Object.entries(saleCategories)) {
      console.log(`\n📦 Seeding sale ${category}...`);
      for (const product of products) {
        const newProduct = await createProductDocument(product, category, "sale");
        console.log(`✅ Created: ${newProduct.name}`);
      }
    }

    const newCount = await Product.countDocuments();
    console.log(`\n✨ Database seeded successfully with ${newCount} products`);
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();

