import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { getProfile, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile',authenticateUser, getProfile);
router.patch('/profile',authenticateUser, updateProfile);

export default router