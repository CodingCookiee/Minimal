import express from 'express'
import { authenticateUser } from '../middleware/auth.middleware.js'
import { addToCart, getCartItems, removeCartItems, updateQuantity } from '../controllers/cart.controller.js'

router = express.Router();

router.post('/', authenticateUser, addToCart);
router.get('/', authenticateUser, getCartItems);
router.delete('/:id', authenticateUser, removeCartItems);
router.put('/:id', authenticateUser, updateQuantity);


export default router