import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer, Slide } from "react-toastify";
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
            <ToastContainer
              position="bottom-right"
              autoClose={2000}
              limit={1}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              transition={Slide}
            />
          </GoogleOAuthProvider>
        </CartProvider>
      </OrderProvider>
    </UserProvider>
  </StrictMode>
);
