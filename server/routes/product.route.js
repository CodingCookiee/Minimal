import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  toggleFeaturedProduct,
  getProductsByTypeAndCategory,
  getSingleProduct,
} from "../controllers/product.controller.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateUser, getAllProducts);
router.get("/:id", getSingleProduct);
router.get("/:type/:category?", getProductsByTypeAndCategory);
router.post("/", authenticateUser, authenticateAdmin, createProduct);
router.delete("/:id", authenticateUser, authenticateAdmin, deleteProduct);
router.get("/featured", getFeaturedProducts);
router.patch(
  "/:id",
  authenticateUser,
  authenticateAdmin,
  toggleFeaturedProduct,
);

export default router;
