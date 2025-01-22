import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loading } from "./Loading";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <button
        type="submit"
        disabled={isLoading || !stripe}
        className="w-full bg-dark-primary text-light-primary py-3 rounded-md 
                   hover:bg-light-primary hover:text-dark-primary border border-dark-primary 
                   transition-all duration-300 disabled:opacity-50"
      >
        {isLoading ? (
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
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
};

export { CheckoutForm };
