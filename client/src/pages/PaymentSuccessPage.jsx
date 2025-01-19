import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import axiosInstance from "../utils/axios";
import { useCart } from "../utils/CartContext";
import { useOrder } from '../utils/OrderContext';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateCart } = useCart();
  const paymentIntentId = searchParams.get("payment_intent");
  const { updateOrders } = useOrder();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const response = await axiosInstance.post("/payment/payment-success", {
          paymentIntentId
        });
        updateCart([]);
        updateOrders(prevOrders => [...prevOrders, response.data.order]);
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
    };

    if (paymentIntentId) {
      confirmPayment();
    }
  }, [paymentIntentId]);
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="font-sf-heavy text-3xl mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">Your order has been confirmed.</p>
        <div className="space-x-4">
          <motion.button
            onClick={() => navigate("/account")}
            className="px-6 py-3 bg-dark-primary text-light-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Orders
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

export default PaymentSuccessPage;