import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart,
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios";
import { Loading } from "../ui";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axiosInstance.get("/analytics");
      setAnalyticsData(response.data);
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching analytics");
      setError(err.response?.data?.message || "Error fetching analytics");
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-sf-regular">
            Something went wrong
          </h1>
          <p className="text-gray-500 font-sf-light mb-4">{error}</p>
        </div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="flex items-center gap-2 mb-6">
        <BarChart className="h-6 w-6" />
        <h2 className="text-2xl font-bold font-sf-heavy">
          Analytics Dashboard
        </h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500  font-sf-light">
                Total Products
              </p>
              <h3 className="text-2xl font-bold">
                {analyticsData?.totalProducts}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-sf-light">Total Users</p>
              <h3 className="text-2xl font-bold">
                {analyticsData?.totalUsers}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <ShoppingBag className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-sf-light">
                Total Orders
              </p>
              <h3 className="text-2xl font-bold">
                {analyticsData?.totalOrders}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-sf-light">Total Sales</p>
              <h3 className="text-2xl font-bold">
                ${analyticsData?.totalSales?.toFixed(2) || "0.00"}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-4 font-sf-semibold">
          Top Products
        </h3>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-sf-medium">Product</th>
                <th className="text-left py-3 px-4 font-sf-medium">
                  Total Sold
                </th>
                <th className="text-left py-3 px-4 font-sf-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData?.topProducts.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex items-center gap-3 hover:text-blue-600"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                      <span className="font-sf-light">{product.name}</span>
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                      {product.totalSold}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      {product.revenue.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {analyticsData?.topProducts.map((product) => (
            <motion.div
              key={product._id}
              className="bg-white p-4 rounded-lg shadow-sm border"
              whileHover={{ scale: 1.02 }}
            >
              <Link to={`/product/${product._id}`}>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded"
                  />
                  <h4 className="font-sf-regular">{product.name}</h4>
                </div>
              </Link>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-sf-light">
                    Total Sold
                  </p>
                  <p className="font-sf-regular flex items-center gap-1">
                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                    {product.totalSold}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-sf-light">Revenue</p>
                  <p className="font-sf-regular flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />$
                    {product.revenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
