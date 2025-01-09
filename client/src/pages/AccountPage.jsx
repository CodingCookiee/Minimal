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
import { BadgePlus, Trash2, CircleX } from "lucide-react";

const AccountPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: userData, accountLoading: isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/profile");
      return response.data;
    },
  });

  const { mutate: deleteAddress } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete("/user/address");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <div className="orders-container">
            <h2 className="text-xl font-bold mb-4">Order History</h2>
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
              <p>You haven&apos;t placed any orders yet.</p>
            )}
          </div>
        );

      case "address":
        return (
          <div className="address-container">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            {userData?.address ? (
              <div>
                <p>
                  <b className="text-md font-sf-light mr-2.5">Name:</b>{" "}
                  {userData.address.name}
                </p>
                <p>
                  <b className="text-md font-sf-light mr-2.5">Address:</b>{" "}
                  {userData.address.address1}
                </p>
                <p>
                  <b className="text-md font-sf-light mr-2.5">Address 2:</b>{" "}
                  {userData.address.address2}
                </p>
                <p>
                  <b className="text-md font-sf-light mr-2.5">City:</b>{" "}
                  {userData.address.city}
                </p>
                <p>
                  <b className="text-md font-sf-light mr-2.5">Country:</b>{" "}
                  {userData.address.country}
                </p>
                <p>
                  <b className="text-md font-sf-light mr-2.5">Postal Code:</b>{" "}
                  {userData.address.postalCode}
                </p>
                <p>
                  <b className="text-md font-sf-light mr-2.5">Phone:</b>{" "}
                  {userData.address.phone}
                </p>
              </div>
            ) : (
              <p>You haven&apos;t added any addresses yet.</p>
            )}
            <div className="flex justify-start gap-2.5">
              <Button
                type="submit"
                className="mt-5 rounded-md bg-dark-primary text-light-primary hover:bg-light-primary hover:text-dark-primary transition-all duration-300"
                onClick={() => navigate("/add-address")}
              >
                <span className="flex items-center justify-center">
                  Add a new address
                  <BadgePlus className="ml-2 mb-1 h-4 w-4" />
                </span>
              </Button>

              <Button
                type="button"
                className="mt-5 rounded-md bg-red-700 text-light-primary hover:bg-red-600 transition-all duration-300"
                onClick={() => setShowDeleteDialog(true)}
              >
                <span className="flex items-center justify-center">
                  Delete Address
                  <Trash2 className="ml-2 mb-1 h-4 w-4" />
                </span>
              </Button>
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
                      onClick={() => {
                        deleteAddress();
                        setShowDeleteDialog(false);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteDialog(false)}
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
            <h2 className="text-xl font-bold mb-4">Account Details</h2>
            <p>Name: {userData?.name}</p>
            <p>Email: {userData?.email}</p>
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
        <div className="tabs flex gap-4 mb-8">
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
