import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
  getProductsByTypeAndCategory
} from "../controllers/product.controller.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, authenticateAdmin, createProduct);
router.get("/", authenticateUser, authenticateAdmin, getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/featured", getFeaturedProducts);
router.get("/recommended", getRecommendedProducts);
router.patch(
  "/:id",
  authenticateUser,
  authenticateAdmin,
  toggleFeaturedProduct,
);

router.get("/:type/:category?", getProductsByTypeAndCategory);
router.delete("/:id", authenticateUser, authenticateAdmin, deleteProduct);

export default router;
