import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { useCart } from "../utils/CartContext";
import axiosInstance from "../utils/axios";
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ clientSecret, addressId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { cartItems } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
  
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        await axiosInstance.post('/payment/payment-success', {
          paymentIntentId: paymentIntent.id
        });
        window.location.href = `/payment/success?payment_intent=${paymentIntent.id}`;
      } else {
        toast.error(error?.message || 'Payment failed');
        window.location.href = '/payment/cancel';
      }
    } catch (err) {
      toast.error('Payment processing failed');
      window.location.href = '/payment/cancel';
    }
    
    setLoading(false);
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 rounded-md border border-neutral-200">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
                fontFamily: 'SF Pro Display, system-ui, sans-serif',
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      <motion.button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 bg-dark-primary text-light-primary font-sf-medium disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </motion.button>
    </form>
  );
};

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { cartItems } = useCart();

  useEffect(() => {
    const createPaymentIntent = async () => {
      const response = await axiosInstance.post("/payment/create-payment-intent", {
        items: cartItems,
      });
      setClientSecret(response.data.clientSecret);
    };

    createPaymentIntent();
  }, []);

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="font-sf-heavy text-2xl">Payment Details</h2>
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm clientSecret={clientSecret} />
            </Elements>
          )}
        </div>

        <div className="bg-neutral-50 p-6">
          <h2 className="font-sf-heavy text-2xl mb-6">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.productId._id} className="flex justify-between py-2">
              <span>{item.productId.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-neutral-200 mt-4 pt-4">
            <div className="flex justify-between font-sf-medium">
              <span>Total</span>
              <span>
                ${cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
