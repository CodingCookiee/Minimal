import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "../components/ui";
import axiosInstance from "../utils/axios";
import { Loading, Button } from "../components/ui";
import { useCart } from "../utils/CartContext";
import { useUser } from "../utils/UserContext";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const fetchUserAddresses = async () => {
    try {
      const response = await axiosInstance.get("/user/profile");
      setAddresses(response.data.addresses || []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch addresses");
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    // Store selected address in localStorage or state management
    localStorage.setItem("checkoutAddressId", selectedAddressId);

    // Navigate to payment page
    navigate("/payment");
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Address Selection Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-sf-heavy text-2xl">Select Delivery Address</h2>
            <Link
              to="/add-address"
              className="text-dark-primary hover:underline font-sf-medium"
            >
              Add New Address
            </Link>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No addresses found</p>
              <Link
                to="/add-address"
                className="text-dark-primary hover:underline font-sf-medium"
              >
                Add your first address
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`p-4 border rounded-none shadow-sm backdrop-blur-sm ${
                    selectedAddressId === address._id
                      ? "border-dark-primary"
                      : "border-neutral-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {isUpdating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-5 w-5"
                      >
                        <LoaderCircle className="h-5 w-5 text-neutral-900" />
                      </motion.div>
                    ) : (
                      <>
                        <Checkbox
                          checked={selectedAddressId === address._id}
                          onChange={() => setSelectedAddressId(address._id)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-sf-medium">{address.name}</p>
                          <p className="text-sm text-gray-600">
                            {address.address1}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.address2}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.country}{" "}
                            {address.postalCode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.phone}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-neutral-50 p-6">
          <h2 className="font-sf-heavy text-2xl mb-6">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.productId._id} className="flex justify-between py-2">
              <span>
                {item.productId.name} × {item.quantity}
              </span>
              <span>
                $
                {(
                  (item.productId.discountedPrice || item.productId.price) *
                  item.quantity
                ).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t border-neutral-200 mt-4 pt-4">
            <div className="flex justify-between font-sf-medium">
              <span>Total</span>
              <span>
                $
                {cartItems
                  .reduce(
                    (acc, item) =>
                      acc +
                      (item.productId.discountedPrice || item.productId.price) *
                        item.quantity,
                    0,
                  )
                  .toFixed(2)}
              </span>
            </div>
          </div>
          <motion.button
            onClick={handleCheckout}
            disabled={!selectedAddressId}
            className="mt-5 w-full py-3 bg-dark-primary text-light-primary hover:bg-light-primary
                 hover:text-dark-primary border border-dark-primary transition-all duration-300 font-sf-medium disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full mt-6 py-4 bg-dark-primary text-light-primary font-sf-medium disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCheckout}
                  disabled={!selectedAddressId}
                >
                  <div className="font-sf-light text-xs h-5 w-5 border-2 border-white dark:border-black-200 border-t-transparent rounded-full animate-spin mr-2" />
                  Processing Payment...
                </motion.div>
              ) : (
                <span className=" font-sf-light text-sm flex items-center justify-center">
                  Proceed to Payment
                </span>
              )}
            </Button>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
