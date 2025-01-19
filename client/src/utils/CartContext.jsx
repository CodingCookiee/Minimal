import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const updateCart = (items) => {
    setCartItems(items);
    setCartCount(items.length);
  };

  const updateItemQuantity = (productId, newQuantity) => {
    const updatedItems = cartItems.map((item) =>
      item.productId._id === productId
        ? { ...item, quantity: newQuantity }
        : item,
    );
    updateCart(updatedItems);
    return updatedItems;
  };

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, updateCart, updateItemQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
