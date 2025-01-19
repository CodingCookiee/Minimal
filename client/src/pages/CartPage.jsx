import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axios";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Loading } from "../components/ui";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get("/cart");
      setCartItems(response.data.items || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axiosInstance.put(`/cart/${productId}`, {
        quantity: newQuantity,
      });
      fetchCartItems();
      toast.success("Cart updated successfully");
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axiosInstance.delete(`/cart/${productId}`);
      fetchCartItems();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="font-sf-heavy text-2xl sm:text-3xl mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-sf-light text-lg mb-6">Your cart is empty</p>
          <motion.button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-dark-primary text-light-primary hover:bg-light-primary hover:text-dark-primary border border-dark-primary transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue Shopping
          </motion.button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <motion.div
                key={item.productId._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 border-b border-neutral-200 py-6"
              >
                <img
                  src={item.productId.imagePath[0]}
                  alt={item.productId.title}
                  className="w-24 h-24 object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-sf-medium text-lg">
                    {item.productId.title}
                  </h3>
                  <p className="font-sf-light text-sm text-neutral-600">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-neutral-200">
                      <motion.button
                        className="p-2"
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          updateQuantity(item.productId._id, item.quantity - 1)
                        }
                      >
                        <Minus size={16} />
                      </motion.button>
                      <span className="px-4 font-sf-medium">
                        {item.quantity}
                      </span>
                      <motion.button
                        className="p-2"
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          updateQuantity(item.productId._id, item.quantity + 1)
                        }
                      >
                        <Plus size={16} />
                      </motion.button>
                    </div>
                    <motion.button
                      onClick={() => removeFromCart(item.productId._id)}
                      className="text-red-500 hover:text-red-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-neutral-50 p-6">
              <h2 className="font-sf-medium text-xl mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="font-sf-light">Subtotal</span>
                  <span className="font-sf-medium">${calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sf-light">Shipping</span>
                  <span className="font-sf-light">Calculated at checkout</span>
                </div>
              </div>
              <motion.button
                className="w-full py-3 bg-dark-primary text-light-primary hover:bg-light-primary hover:text-dark-primary border border-dark-primary transition-all duration-300 font-sf-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
