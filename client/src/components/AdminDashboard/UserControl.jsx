import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ShieldOff, Trash2, Users, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios";
import { useUser } from "../../utils/UserContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Loading,
} from "../ui";
import { useNavigate, Link } from "react-router-dom";
import { isPrimaryAdmin } from "../../utils/checkAdmin.js";

const UserControl = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    user: null,
  });
  const { currentUser } = useUser();
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const getAdminRequests = async () => {
      try {
        const response = await axiosInstance.get("/user/admin-requests");
        // Only show pending requests
        setPendingRequests(
          response.data.filter(
            (user) => user.adminRequest && user.role !== "admin",
          ),
        );
      } catch (err) {
        toast.error("Failed to fetch admin requests");
      }
    };

    if (isPrimaryAdmin(currentUser)) {
      getAdminRequests();
    }
  }, [currentUser]);

  const handleRejectRequest = async (userId) => {
    if (!isPrimaryAdmin(currentUser)) {
      toast.error("You lack privileges to use these controls");
      return;
    }

    try {
      await axiosInstance.post(`/user/${userId}/reject-admin`);
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== userId),
      );
      toast.success("Admin request rejected");
    } catch (err) {
      toast.error("Failed to reject admin request");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/user");
      const filteredUsers = response.data.filter(
        (user) => user._id !== currentUser._id,
      );
      setUsers(filteredUsers);
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error retrieving users");
      setError(err.response?.data?.message || "Error retrieving users");
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId, currentRole) => {
    if (!isPrimaryAdmin(currentUser)) {
      toast.error("You lack privileges to use these controls");
      return;
    }
    try {
      const response = await axiosInstance.put(`/user/${userId}/toggle-admin`);

      // Update users list with new role
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, role: response.data.role, adminRequest: false }
            : user,
        ),
      );

      // Remove from pending requests when approved
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== userId),
      );

      toast.success(
        `User ${currentRole === "admin" ? "removed from" : "made"} admin`,
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating admin status");
    }
  };

  const handleDeleteUser = async () => {
    if (!isPrimaryAdmin(currentUser)) {
      toast.error("You lack privileges to use these controls");
      return;
    }
    if (!deleteDialog.user) return;

    try {
      await axiosInstance.delete(`/user/${deleteDialog.user._id}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== deleteDialog.user._id),
      );
      toast.success("User deleted successfully");
      setDeleteDialog({ isOpen: false, user: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting user");
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
          <p className="text-gray-500 mb-4">{error}</p>
          <motion.button
            onClick={() => navigate("/")}
            className="font-sf-regular px-6 py-3 bg-dark-primary text-light-primary hover:bg-light-primary hover:text-dark-primary border border-dark-primary transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Return to Home
          </motion.button>
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
        <Users className="h-6 w-6" />
        <h2 className="text-2xl font-bold font-sf-heavy">User Management</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Desktop Table Header - Hidden on Mobile */}
        <div className="hidden md:grid md:grid-cols-4 bg-gray-50 p-4 rounded-t-lg">
          <div className="font-sf-medium">Name</div>
          <div className="font-sf-medium">Email</div>
          <div className="font-sf-medium">Role</div>
          <div className="font-sf-medium">Actions</div>
        </div>

        {isPrimaryAdmin(currentUser) && pendingRequests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold font-sf-medium mb-4">
              Pending Admin Requests
            </h3>
            <div className="bg-white rounded-lg shadow-sm">
              {pendingRequests.map((user) => (
                <div
                  key={user._id}
                  className="p-4 border-b flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium font-sf-light">{user.name}</p>
                    <p className="text-sm text-gray-600 font-sf-light">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleAdmin(user._id, user.role)}
                      variant="default"
                      className="font-sf-light"
                    >
                      <Check size={18} className="text-green-600" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectRequest(user._id)}
                      variant="destructive"
                      className="font-sf-light"
                    >
                      <X size={18} className="text-red-600" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User List */}
        {users.map((user) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t"
          >
            {/* Desktop View */}
            <div className="hidden md:grid md:grid-cols-4 gap-4 p-4 items-center">
              <div className="font-sf-light font-light text-neutral-600 text-sm">
                {user.name}
              </div>
              <div className="font-sf-light font-light text-neutral-600 text-sm">
                {user.email}
              </div>
              <div className="font-sf-light font-light text-neutral-600 text-sm">
                {isPrimaryAdmin(user) ? "Primary Admin" : user.role}
              </div>
              <div className="flex items-center justify-start ">
                <div>
                  <Button
                    variant={user.role === "admin" ? "destructive" : "default"}
                    size="sm"
                    disabled={!isPrimaryAdmin(currentUser)}
                    onClick={() => handleToggleAdmin(user._id, user.role)}
                  >
                    {user.role === "admin" ? (
                      <div className="flex items-center justify-start font-sf-light font-light text-neutral-700">
                        <ShieldOff className="w-4 h-4 mr-2 text-green-6s00" />{" "}
                        Remove Admin
                      </div>
                    ) : (
                      <div className="flex items-center justify-start font-sf-light font-light text-neutral-700">
                        <Shield className="w-4 h-4 mr-2" /> Make Admin
                      </div>
                    )}
                  </Button>
                </div>
                <div>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={!isPrimaryAdmin(currentUser)}
                    onClick={() => setDeleteDialog({ isOpen: true, user })}
                    className=" font-sf-light font-light text-neutral-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2 text-red-700" /> Delete
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-sf-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500 font-sf-light">
                      {user.email}
                    </p>
                    <span className="font-sf-light inline-block mt-1 px-2 py-1 text-xs rounded-full bg-neutral-200">
                      {isPrimaryAdmin(user) ? "Primary Admin" : user.role}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={user.role === "admin" ? "destructive" : "default"}
                    size="sm"
                    disabled={!isPrimaryAdmin(currentUser)}
                    onClick={() => handleToggleAdmin(user._id, user.role)}
                    className="w-full font-sf-light font-light text-neutral-700"
                  >
                    {user.role === "admin" ? (
                      <>
                        <ShieldOff className="w-4 h-4 mr-2 text-green-600" />{" "}
                        Remove Admin
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" /> Make Admin
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={!isPrimaryAdmin(currentUser)}
                    onClick={() => setDeleteDialog({ isOpen: true, user })}
                    className="w-full font-sf-light font-light text-neutral-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2 text-red-700" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) => setDeleteDialog({ isOpen, user: null })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-sf-heavy">Delete User</DialogTitle>
          </DialogHeader>
          <div className="py-4 font-sf-light text-sm">
            <p>Are you sure you want to delete {deleteDialog.user?.name}?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, user: null })}
              className="font-sf-light"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              className="font-sf-light text-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default UserControl;
