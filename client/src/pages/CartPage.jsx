import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axios";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Loading, Button } from "../components/ui";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../utils/CartContext";

const CartPage = () => {
  const { cartItems, updateItemQuantity, updateCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get("/cart");
      updateCart(response.data.items || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axiosInstance.put(`/cart/${productId}`, {
        quantity: newQuantity,
      });
      updateItemQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axiosInstance.delete(`/cart/${productId}`);
      const updatedItems = cartItems.filter(
        (item) => item.productId._id !== productId
      );
      updateCart(updatedItems);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const hasDiscount =
          item.productId.discountedPrice &&
          item.productId.discountedPrice < item.productId.price;
        const price = hasDiscount
          ? item.productId.discountedPrice
          : item.productId.price;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-sf-medium">Unable to initialize payment</h1>
          <p className="text-gray-500 mb-4">{error}</p>
          <motion.button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-dark-primary text-light-primary hover:bg-light-primary hover:text-dark-primary border border-dark-primary transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Return to Home
          </motion.button>
        </div>
      </div>
    );

  if (!cartItems.length) {
    return (
      <div className="min-h-screen pt-28 px-4 text-center">
        <h2 className="text-xl font-sf-heavy">Your cart is empty</h2>
        <Link
          to="/"
          className="inline-block mt-4 px-6 py-2 bg-dark-primary text-light-primary"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-sf-heavy mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const hasDiscount =
              item.productId.discountedPrice &&
              item.productId.discountedPrice < item.productId.price;

            return (
              <motion.div
                key={item.productId._id}
                className="bg-white p-4 rounded-lg shadow-sm"
                layout
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-sf-medium">{item.productId.name}</h3>
                    <div className="flex items-center gap-2 mt-1 font-sf-light">
                      {hasDiscount ? (
                        <>
                          <span className="text-gray-400 line-through">
                            ${item.productId.price}
                          </span>
                          <span className="font-sf-medium">
                            ${item.productId.discountedPrice}
                          </span>
                        </>
                      ) : (
                        <span className="font-sf-medium">
                          ${item.productId.price}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-5 mt-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            updateQuantity(
                              item.productId._id,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus size={20} />
                        </motion.button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            updateQuantity(
                              item.productId._id,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus size={20} />
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
                </div>
              </motion.div>
            );
          })}
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
            <Link to="/checkout">
              <motion.button
                className="w-full py-3 bg-dark-primary text-light-primary hover:bg-light-primary
                          hover:text-dark-primary border border-dark-primary transition-all duration-300 font-sf-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
