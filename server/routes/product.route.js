import express from 'express'
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getFeaturedProducts,
	getProductsByCategory,
	getRecommendedProducts,
	toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { authenticateUser, authenticateAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/', authenticateAdmin, authenticateUser, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/recommended', getRecommendedProducts);
router.post('/', authenticateUser, authenticateAdmin, createProduct);
router.delete('/:id', authenticateUser, authenticateAdmin, deleteProduct);
router.patch('/:id', authenticateUser, authenticateAdmin, toggleFeaturedProduct);
