import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axios";
import { Loading } from "../ui";
import { useOrder } from "../../utils/OrderContext";

export const OrderHistory = () => {
  const { orders, updateOrders } = useOrder();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/orders");
        updateOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-sf-heavy">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 border border-neutral-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-sf-medium text-sm text-gray-600">
                    Order ID: {order._id}
                  </p>
                  <p className="font-sf-medium text-sm text-gray-600">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {order.paymentStatus}
                </span>
              </div>

              <div className="space-y-4">
                {order.products.map((item) => (
                  <div key={item.productId._id} className="flex gap-4">
                    <img
                      src={
                        item.productId?.imagePath?.[0] ||
                        "/placeholder-image.jpg"
                      }
                      alt={item.productId?.name || "Product"}
                      className="w-20 h-20 object-contain"
                    />
                    <div>
                      <p className="font-sf-medium">{item.productId?.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ${item.price?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span className="font-sf-medium">Total Amount</span>
                  <span className="font-sf-medium">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Shipping Address: {order.shippingAddress}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
