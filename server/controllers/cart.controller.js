import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import createError from "../utils/createError.utils.js";

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
      return next(createError(404, "Product not found"));
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalAmount: 0,
      });
    }
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      });
    }
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const getCartItems = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: "items.productId",
      model: "Product",
    });

    res.status(200).json(cart || { items: [], totalAmount: 0 });
  } catch (err) {
    next(createError(500, err.message));
  }
};

export const removeCartItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return next(createError(404, "Cart not found"));
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const updateQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return next(createError(404, "Cart not found"));
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (!item) {
      return next(createError(404, "Item not found in cart"));
    }

    item.quantity = quantity;

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(createError(500, error.message));
  }
};
