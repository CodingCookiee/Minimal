import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axios.js";
import { motion, AnimatePresence } from "framer-motion";
import { AccountDetails } from "../components/Account/AccountDetails";
import { OrderHistory } from "../components/Account/OrderHistory";
import { ShippingAddresses } from "../components/Account/ShippingAddresses";
import { SquareUser, ShoppingBasket, BookUser } from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "../utils/UserContext";

const AccountPage = () => {
  const { updateUser } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [Errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { data: userData, accountLoading: isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/profile");
      return response.data;
    },
  });

  const { mutate: deleteAddress } = useMutation({
    mutationFn: async (addressId) => {
      const response = await axiosInstance.delete(`/user/address/${addressId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      toast.success("Address deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error deleting address");
    },
  });

  const { mutate: updateProfile, isLoading: isUpdating } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.put("/user/profile", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      toast.success("Profile updated successfully.");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error updating profile");
    },
  });

  const handleDeleteClick = (addressId) => {
    setAddressToDelete(addressId);
    setShowDeleteDialog(true);
  };

  const handleDeleteAddress = () => {
    if (addressToDelete) {
      deleteAddress(addressToDelete);
      setShowDeleteDialog(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const formData = new FormData(document.querySelector("form"));
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    // Name validation (required)
    if (!name || name.trim().length < 5) {
      newErrors.name = "Name must be at least 5 characters";
    }

    // Email validation (optional)
    if (email && email !== userData?.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email";
      }
    }

    // Password validation (optional)
    if (password && password.trim() !== userData?.password) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(password)) {
        newErrors.password =
          "Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters (!@#$%^&*)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    // Only include changed fields
    const data = {};
    if (name !== userData?.name) data.name = name;
    if (email && email !== userData?.email) data.email = email;
    if (password && password.trim() !== userData?.password)
      data.password = password;

    // Only proceed if there are changes
    if (Object.keys(data).length > 0) {
      updateProfile(data, {
        onSuccess: async () => {
          // Only logout if email or password was changed
          if (data.email || data.password) {
            await axiosInstance.post("/auth/logout");
            updateUser(null);
            navigate("/signin");
            toast.success("Please signin again.");
          } else {
            setIsEditing(false);
          }
        },
      });
    } else {
      setIsEditing(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <div className="details-tab">
            <AccountDetails
              userData={userData}
              onSubmit={handleSubmit}
              isUpdating={isUpdating}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              errors={Errors}
            />
          </div>
        );
      case "orders":
        return (
          <div className="">
            <OrderHistory orders={userData?.orders} />
          </div>
        );
      case "address":
        return (
          <div className="address-tab  ">
            <ShippingAddresses
              addresses={userData?.addresses}
              onDelete={handleDeleteAddress}
              handleDeleteClick={handleDeleteClick}
              onNavigate={navigate}
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
            />
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-4xl mx-auto mt-24">
        <div className="tabs flex gap-10 mb-8 font-sf-semibold ">
          <div className="flex flex-col relative">
            <SquareUser className="absolute left-0 top-0 h-5 w-5  text-black-500 dark:text-white-500" />
            <button
              onClick={() => setActiveTab("details")}
              className={`tab ml-6 ${activeTab === "details" ? "active" : ""}`}
            >
              Account Details
            </button>
          </div>
          <div className="flex flex-col relative">
            <ShoppingBasket className="absolute left-0 top-0 h-5 w-5  text-black-500 dark:text-white-500" />
            <button
              onClick={() => setActiveTab("orders")}
              className={`tab ml-6 ${activeTab === "orders" ? "active" : ""}`}
            >
              Orders
            </button>
          </div>
          <div className="flex flex-col relative">
            <BookUser className="absolute left-0 top-0 h-5 w-5  text-black-500 dark:text-white-500" />
            <button
              onClick={() => setActiveTab("address")}
              className={`tab ml-6 ${activeTab === "address" ? "active" : ""}`}
            >
              Address
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AccountPage;
