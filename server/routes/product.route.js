import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductsByTypeAndCategory,
  getSingleProduct,
  searchProducts,
} from "../controllers/product.controller.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/search", searchProducts);
router.post("/", authenticateUser, authenticateAdmin, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.get("/:type/:category?", getProductsByTypeAndCategory);
router.delete("/:id", authenticateUser, authenticateAdmin, deleteProduct);

export default router;
