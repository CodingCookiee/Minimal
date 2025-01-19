import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./utils/UserContext";
import { CartProvider } from "./utils/CartContext";
import { OrderProvider } from "./utils/OrderContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
    <OrderProvider>
    <CartProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </GoogleOAuthProvider>
      </CartProvider>
      </OrderProvider>
    </UserProvider>
  </StrictMode>,
);
