import React, { useState } from "react";
import UserControl from "../components/AdminDashboard/UserControl";
import ProductControl from "../components/AdminDashboard/ProductControl";
import Analytics from "../components/AdminDashboard/Analytics";
import CreateProduct from "../components/AdminDashboard/CreateProduct";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="p-8 max-w-7xl mx-auto my-10">
      <h1 className="text-3xl font-bold text-center mb-8 font-sf-heavy">
        Admin Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button
          className={`font-sf-medium px-6 py-3 border-2 border-[#0E0E10] rounded-md transition-all
            ${
              activeTab === "users"
                ? "bg-[#0E0E10] text-white"
                : "bg-transparent text-[#0E0E10] hover:bg-[#0E0E10] hover:text-white"
            }`}
          onClick={() => setActiveTab("users")}
        >
          User Control
        </button>
        <button
          className={` font-sf-medium px-6 py-3 border-2 border-[#0E0E10] rounded-md transition-all
            ${
              activeTab === "products"
                ? "bg-[#0E0E10] text-white"
                : "bg-transparent text-[#0E0E10] hover:bg-[#0E0E10] hover:text-white"
            }`}
          onClick={() => setActiveTab("products")}
        >
          Product Control
        </button>
        <button
          className={`font-sf-medium px-6 py-3 border-2 border-[#0E0E10] rounded-md transition-all
            ${
              activeTab === "analytics"
                ? "bg-[#0E0E10] text-white"
                : "bg-transparent text-[#0E0E10] hover:bg-[#0E0E10] hover:text-white"
            }`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>

        <button
          className={`font-sf-medium px-6 py-3 border-2 border-[#0E0E10] rounded-md transition-all
            ${
              activeTab === "create-products"
                ? "bg-[#0E0E10] text-white"
                : "bg-transparent text-[#0E0E10] hover:bg-[#0E0E10] hover:text-white"
            }`}
          onClick={() => setActiveTab("create-products")}
        >
          Create New Product
        </button>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-md">
        {activeTab === "users" && <UserControl />}
        {activeTab === "products" && <ProductControl />}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "create-products" && <CreateProduct />}
      </div>
    </div>
  );
};

export default AdminPage;
