import express from "express";
import {
  signin,
  logout,
  signup,
  forgotPassword,
  resetPassword,
  refreshToken,
  googleAuth,
} from "../controllers/auth.controller.js";
import {
  validateSignup,
  validatePasswordReset,
} from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", validatePasswordReset, resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/google", googleAuth);

export default router;
