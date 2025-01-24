import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import ProductForm from "../ui/ProductForm";
import { useUser } from "../../utils/UserContext";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { Loading } from "../ui";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (currentUser) {
      const checkAdminStatus = async () => {
        try {
          const response = await axiosInstance.get("/user/profile");
          if (response.data.role !== "admin") {
            setError("Access Denied - Admin Only");
          }
          setLoading(false);
        } catch (error) {
          setError(error.response?.data?.message || "Error checking admin status");
          setLoading(false);
        }
      };

      checkAdminStatus();
    }
  }, [currentUser]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-sf-regular">
            Something went wrong
          </h1>
          <p className="text-gray-500 mb-4">{error}</p>
          <motion.button
            onClick={() => navigate("/")}
            className="font-sf-regular px-6 py-3 bg-dark-primary text-light-primary hover:bg-light-primary hover:text-dark-primary border border-dark-primary transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Return to Home
          </motion.button>
        </div>
      </div>
    );
  }

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
