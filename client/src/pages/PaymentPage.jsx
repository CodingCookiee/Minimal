import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { useCart } from "../utils/CartContext";
import axiosInstance from "../utils/axios";
import { Loading } from "../components/ui";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const { cartItems } = useCart();

  const fetchClientSecret = useCallback(async () => {
    try {
      const response = await axiosInstance.post(
        "/payment/create-checkout-session",
        {
          items: cartItems,
        }
      );
      const secret = response.data.clientSecret;
      setClientSecret(secret);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [cartItems]);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  const options = {
    clientSecret,
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2"
      >
        <span className="text-xl font-sf-semibold text-neutral-600">
          Preparing Secure Checkout
        </span>
        <Loading height="h-[600px]" width="w-8" />
      </motion.div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Unable to initialize payment</h1>
          <p className="text-gray-500 mb-4">{error}</p>
          <motion.button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-dark-primary text-light-primary hover:bg-light-primary 
                     hover:text-dark-primary border border-dark-primary transition-all duration-300"
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
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <svg width="0" height="0">
            <defs>
              <linearGradient
                id="gradient-primary"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" style={{ stopColor: "#3B82F6" }} />
                <stop offset="30%" style={{ stopColor: "#3B82f5" }} />
                <stop offset="100%" style={{ stopColor: "#8B5CF6" }} />
              </linearGradient>
            </defs>
          </svg>
          <CreditCard
            className="w-10 h-10"
            style={{ fill: "url(#gradient-primary)" }}
          />

          <h2 className="font-sf-heavy font-semibold text-3xl ">
            Payment Details
          </h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </motion.div>
    </div>
  );
};
export default PaymentPage;
