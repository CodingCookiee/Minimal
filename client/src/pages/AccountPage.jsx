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
} from "../components/ui";
import { BadgePlus, Trash2, CircleX, Pencil } from "lucide-react";
import { toast } from "react-toastify";

const AccountPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

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
                      <b className="text-md font-sf-light mr-2.5">Order ID:</b>{" "}
                      {order._id}
                    </p>
                    <p>
                      <b className="text-md font-sf-light mr-2.5">
                        Total Amount:
                      </b>{" "}
                      ${order.totalAmount}
                    </p>
                    <p>
                      <b className="text-md font-sf-light mr-2.5">Status:</b>{" "}
                      {order.status}
                    </p>
                    <p>
                      <b className="text-md font-sf-light mr-2.5">
                        Payment Method:
                      </b>{" "}
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="font-sf-light">
                You haven't placed any orders yet.
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
              className="rounded-none mt-2.5 mb-5 font-sf-light text-xs uppercase bg-dark-primary text-light-primary hover:bg-light-primary hover:text-dark-primary transition-all duration-300"
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
                    <p className="font-sf-light">{address.name}</p>
                    <p className="font-sf-light">{address.address1}</p>
                    <p className="font-sf-light">{address.address2}</p>
                    <p className="font-sf-light">{address.city}</p>
                    <p className="font-sf-light">{address.country}</p>
                    <p className="font-sf-light">{address.postalCode}</p>
                    <p className="font-sf-light">{address.phone}</p>

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
                <p className="font-sf-light">
                  You haven't added any shipping address yet.
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
            <p className="font-sf-light"> {userData?.name}</p>
            <p className="font-sf-light"> {userData?.email}</p>
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
