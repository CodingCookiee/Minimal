import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import axiosInstance from "../utils/axios";
import { useCart } from "../utils/CartContext";
import { useOrder } from "../utils/OrderContext";
import { toast } from "react-toastify";

const ReturnPage = () => {
  const { updateCart } = useCart();
  const { updateOrders } = useOrder();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      axiosInstance.post('/payment/checkout-success', { session_id: sessionId })
        .then((response) => {
          updateOrders((prevOrders) => [...prevOrders, response.data.order]);
          updateCart([]); 
          toast.success('Order placed successfully!');
          navigate('/account');
        })
        .catch((error) => {
          console.error('Order Processing Error:', error.message);
          toast.error('Error processing order');
          navigate('/cart');
        });
    }
  }, [sessionId, navigate, updateCart, updateOrders]);
  



  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {sessionId ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="font-sf-heavy text-3xl mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">Your order has been confirmed.</p>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="font-sf-heavy text-3xl mb-4">Payment Failed</h1>
            <p className="text-gray-600 mb-8">Please try again.</p>
          </>
        )}
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
export default ReturnPage;
