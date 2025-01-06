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

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/google", googleAuth);

export default router;
