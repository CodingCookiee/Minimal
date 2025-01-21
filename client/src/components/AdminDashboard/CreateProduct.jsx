import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios";
import ProductForm from "../ui/ProductForm";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    name: "",
    subtitle: "",
    description: "",
    price: "",
    stock: "",
    gender: "",
    category: "",
    image: [],
    colors: [],
    sizes: [],
  });

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

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await axiosInstance.post("/product", formData);
      toast.success("Product created successfully");
    } catch (err) {
      console.log("Error creating product:", err.message);
      toast.error("Error creating product");
    } finally {
      setLoading(false);
    }
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

      <ProductForm
        loading={loading}
        onSubmit={handleSubmit}
        categoryData={categoryData}
      />
    </motion.div>
  );
};

export default CreateProduct;
