import express from 'express';
import { login, logout, signup, forgotPassword, resetPassword, refreshToken } from '../controllers/auth.controller.js';


const router = express.Router();

router.post('/signup', signup )
router.post('/login', login)
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/refresh-token', refreshToken)

export default router;