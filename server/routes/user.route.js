import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  editAddress,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", authenticateUser, getProfile);
router.patch("/profile", authenticateUser, updateProfile);
router.post("/address", authenticateUser, addAddress);
router.put("/address", authenticateUser, editAddress);
router.delete("/address", authenticateUser, deleteAddress);

export default router;
