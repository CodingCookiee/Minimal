import express from "express";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  editAddress,
  deleteUser,
  getAllUsers,
  toggleAdmin,
  requestAdminAccess,
  getAdminRequests,
  rejectAdminRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", authenticateUser, getProfile);
router.put("/profile", authenticateUser, updateProfile);
router.post("/address", authenticateUser, addAddress);
router.put("/address/:addressId", authenticateUser, editAddress);
router.delete("/address/:addressId", authenticateUser, deleteAddress);
router.get("/", authenticateUser, authenticateAdmin, getAllUsers);
router.post("/request-admin-access", authenticateUser, requestAdminAccess);
router.get(
  "/admin-requests",
  authenticateUser,
  authenticateAdmin,
  getAdminRequests,
);
router.post(
  "/:userId/reject-admin",
  authenticateUser,
  authenticateAdmin,
  rejectAdminRequest,
);

router.put(
  "/:userId/toggle-admin",
  authenticateUser,
  authenticateAdmin,
  toggleAdmin,
);
router.delete("/:userId", authenticateUser, authenticateAdmin, deleteUser);

export default router;
