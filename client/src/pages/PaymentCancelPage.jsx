import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="font-sf-heavy text-3xl mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">Your order has not been processed.</p>
        <div className="space-x-4">
          <motion.button
            onClick={() => navigate("/cart")}
            className="px-6 py-3 bg-dark-primary text-light-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Return to Cart
          </motion.button>
          <motion.button
            onClick={() => navigate("/")}
            className="px-6 py-3 border border-dark-primary text-dark-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue Shopping
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancelPage;
