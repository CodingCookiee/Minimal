import express from 'express'
import { authenticateUser } from '../middleware/auth.middleware.js'
import { getCoupon, validateCoupon } from '../controllers/coupon.controller.js'

const router = express.Router();

router.get('/', authenticateUser, getCoupon);
router.post('/', authenticateUser, validateCoupon);

export default router;