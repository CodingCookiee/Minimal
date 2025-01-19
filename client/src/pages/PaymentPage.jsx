import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { useCart } from "../utils/CartContext";
import axiosInstance from "../utils/axios";
import { LoaderCircle } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const [loading, setLoading] = useState(true);
  const { cartItems } = useCart();

  const fetchClientSecret = useCallback(async () => {
    const response = await axiosInstance.post(
      "/payment/create-checkout-session",
      {
        items: cartItems,
      },
    );
    return response.data.clientSecret;
  }, [cartItems]);

  const options = { fetchClientSecret };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <motion.div
  //         animate={{ rotate: 360 }}
  //         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  //       >
  //         <LoaderCircle className="w-12 h-12 text-dark-primary" />
  //       </motion.div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="font-sf-heavy text-2xl">Payment Details</h2>
          <div id="checkout">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
