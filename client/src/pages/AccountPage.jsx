import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axios.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
} from "../components/ui";
import {
  BadgePlus,
  Trash2,
  CircleX,
  Pencil,
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";
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
      toast.success("Profile updated successfully. Please sign in again.");
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

    if (!name || name.length < 5) {
      newErrors.name = "Name must be at least 5 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      newErrors.password =
        "Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters (!@#$%^&*)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name') || undefined,
      email: formData.get('email') || undefined,
      password: formData.get('password')?.trim() || undefined
    };

    updateProfile(data, {
      onSuccess: async () => {
        await axiosInstance.post("/auth/logout");
        updateUser(null);
        navigate("/signin");
      }
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <div className="orders-container">
            <h2 className="text-3xl font-sf-heavy font-bold mb-4">
              Order History
            </h2>
            {userData?.orders?.length > 0 ? (
              userData.orders.map((order) => (
                <div key={order._id} className="order-item">
                  <div>
                    <p>
                      <b className="text-md font-sf-light   text-neutral-600 mr-2.5 text-neutral">
                        Order ID:
                      </b>{" "}
                      {order._id}
                    </p>
                    <p>
                      <b className="text-md font-sf-light   text-neutral-600 mr-2.5">
                        Total Amount:
                      </b>{" "}
                      ${order.totalAmount}
                    </p>
                    <p>
                      <b className="text-md font-sf-light   text-neutral-600 mr-2.5">
                        Status:
                      </b>{" "}
                      {order.status}
                    </p>
                    <p>
                      <b className="text-md font-sf-light   text-neutral-600 mr-2.5">
                        Payment Method:
                      </b>{" "}
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-md font-sf-light   text-neutral-600">
                You haven&apos;t placed any orders yet.
              </p>
            )}
          </div>
        );

      case "address":
        return (
          <div className="address-container">
            <h2 className="text-3xl font-sf-heavy font-bold mb-4">
              Shipping Addresses
            </h2>
            <Button
              type="submit"
              className="rounded-none mt-2.5 mb-5 font-sf-light   text-xs uppercase bg-dark-primary text-light-primary hover:bg-light-primary hover:text-dark-primary transition-all duration-300"
              onClick={() => navigate("/add-address")}
            >
              <span className="flex items-center justify-center">
                Add a new address
                <BadgePlus className="ml-2 mb-1 h-4 w-4" />
              </span>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData?.addresses?.length > 0 ? (
                userData.addresses.map((address) => (
                  <div key={address._id} className=" p-4 ">
                    {address.isDefault && (
                      <span className=" text-xl font-sf-heavy font-bold  py-1 mb-2 inline-block">
                        Default
                      </span>
                    )}
                    <p className="font-sf-light  text-neutral-600">
                      {address.name}
                    </p>
                    <p className="font-sf-light   text-neutral-600 mt-1">
                      {address.address1}
                    </p>
                    <p className="font-sf-light   text-neutral-600">
                      {address.address2}
                    </p>
                    <div className="flex justify-start gap-2.5 mt-1">
                      <p className="font-sf-light   text-neutral-600">
                        {address.city}
                      </p>
                      <div className="mt-1 h-[15px] border-[0.5px] border-neutral-500"></div>

                      <p className="font-sf-light   text-neutral-600 ">
                        {address.country}
                      </p>
                    </div>
                    <div className="flex justify-start gap-2.5 mt-1">
                      <p className="font-sf-light    text-neutral-600">
                        {address.postalCode}
                      </p>
                      <div className="mt-1 h-[15px] border-[0.5px] border-neutral-500"></div>

                      <p className="font-sf-light   text-neutral-600">
                        {address.phone}
                      </p>
                    </div>

                    <div className="flex justify-start gap-2.5 mt-4">
                      <Button
                        type="button"
                        className="font-extralight text-lg p-0"
                        onClick={() => navigate(`/edit-address/${address._id}`)}
                      >
                        <span className="flex items-center justify-center">
                          Edit
                          <Pencil className="ml-2 mb-1 h-4 w-4" />
                        </span>
                      </Button>
                      <Button
                        type="button"
                        className="font-extralight text-lg p-0 ml-8"
                        onClick={() => handleDeleteClick(address._id)}
                      >
                        <span className="flex items-center justify-center">
                          Delete
                          <Trash2 className="ml-2 mb-1 h-4 w-4" />
                        </span>
                      </Button>
                    </div>
                    <div className="mt-2.5 border-[0.5px] border-neutral-500"></div>
                  </div>
                ))
              ) : (
                <p className="text-md font-sf-light   text-neutral-600">
                  You haven&apos;t added any shipping address yet.
                </p>
              )}
            </div>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                  <CircleX
                    className="h-4 w-4 absolute right-4 top-4 cursor-pointer"
                    onClick={() => setShowDeleteDialog(false)}
                  />
                  <DialogTitle className="!mb-2">Delete Address</DialogTitle>
                  <DialogDescription className="flex justify-start !mb-2.5">
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="flex justify-end gap-2.5">
                    <Button
                      variant="destructive"
                      className="bg-red-700 text-light-primary hover:bg-red-600 transition-all duration-300"
                      onClick={handleDeleteAddress}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteDialog(false);
                        setAddressToDelete(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      default:
        return (
          <div className="details-container">
            <h2 className="text-3xl font-sf-heavy font-bold mb-4">
              Account Details
            </h2>

            {!isEditing ? (
              <>
                <p className="font-sf-light text-neutral-600">
                  {userData?.name}
                </p>
                <p className="font-sf-light text-neutral-600">
                  {userData?.email}
                </p>
                <Button
                  type="button"
                  className="font-extralight text-lg p-0"
                  onClick={() => setIsEditing(true)}
                >
                  <span className="flex items-center justify-center mt-5">
                    Edit
                    <Pencil className="ml-2  h-4 w-4" />
                  </span>
                </Button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
                  <Input
                    name="name"
                    defaultValue={userData?.name}
                    placeholder="Name"
                    className="pl-10 w-[300px] border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
                  />
                  {Errors.name && (
                    <small className="text-red-500 text-sm mt-1">
                      {Errors.name}
                    </small>
                  )}
                </div>
                <div className="flex flex-col relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5  text-black-500 dark:text-white-500" />

                  <Input
                    name="email"
                    defaultValue={userData?.email}
                    placeholder="Email"
                    className="pl-10 w-[300px] border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
                  />
                  {Errors.email && (
                    <small className="text-red-500 text-sm mt-1">
                      {Errors.email}
                    </small>
                  )}
                </div>
                <div className="flex flex-col relative">
                  <div className="flex  relative">
                    <LockKeyhole className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />

                    <Input
                      name="password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password (optional)"
                      className="pl-10 w-[300px] border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent py-2 sm:py-3"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className=" absolute left-[275px] top-2.5 text-black-500 dark:text-white-500 hover:text-violet-300 dark:hover:text-violet-300 transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {Errors.password && (
                    <small className="text-red-500 text-sm mt-1">
                      {Errors.password}
                    </small>
                  )}
                </div>
                <div className="flex justify-start gap-2.5 mt-4">
                  <Button
                    type="submit"
                    className=" font-extralight text-lg p-0 ml-8"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center"
                      >
                        <div className="h-5 w-5 border-2 border-white dark:border-black-200 border-t-transparent rounded-full animate-spin mr-2" />
                        Saving Changes ...
                      </motion.div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Save Changes
                      </span>
                    )}
                  </Button>
                  <Button
                    type="button"
                    className="font-extralight text-lg p-0 ml-8"
                    onClick={() => setIsEditing(false)}
                  >
                    <span className="flex items-center justify-center">
                      Cancel
                    </span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        );
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
        <div className="tabs flex gap-4 mb-8 font-sf-semibold">
          <button
            onClick={() => setActiveTab("details")}
            className={`tab ${activeTab === "details" ? "active" : ""}`}
          >
            Account Details
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`tab ${activeTab === "orders" ? "active" : ""}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("address")}
            className={`tab ${activeTab === "address" ? "active" : ""}`}
          >
            Address
          </button>
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
