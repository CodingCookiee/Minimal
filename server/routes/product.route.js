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

router.post("/", authenticateUser, authenticateAdmin, createProduct);
router.get("/", authenticateUser, authenticateAdmin, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getSingleProduct);
router.patch(
  "/:id",
  authenticateUser,
  authenticateAdmin,
  toggleFeaturedProduct,
);

router.get("/:type/:category?", getProductsByTypeAndCategory);
router.delete("/:id", authenticateUser, authenticateAdmin, deleteProduct);

export default router;
