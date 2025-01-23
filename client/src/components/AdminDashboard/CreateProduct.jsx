import { useState } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import ProductForm from "../ui/ProductForm";

const CreateProduct = () => {
  const categoryData = {
    men: {
      jeans: "Jeans",
      shirts: "Shirts",
    },
    women: {
      jeans: "Jeans",
      shirts: "Shirts",
      trousers: "Trousers",
    },
    sale: {
      men: "Men's Sale",
      women: "Women's Sale",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6" />
        <h2 className="text-2xl font-bold font-sf-heavy">Create New Product</h2>
      </div>

      <ProductForm categoryData={categoryData} />
    </motion.div>
  );
};

export default CreateProduct;
