import ScrollToTop from "./components/ui/ScrollToTop";
import HomePage from "./pages/HomePage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AccountPage from "./pages/AccountPage";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import AdminPage from "./pages/AdminPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import AddAddressPage from "./pages/AddAddressPage";
import EditAddressPage from "./pages/EditAddressPage";
import SubCategoryPage from "./pages/SubCategoryPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import PaymentPage from "./pages/PaymentPage";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/react";

const App = () => {
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <>
        <QueryClientProvider client={queryClient}>
          <ScrollToTop />
          <Header />
          <Outlet />
          <Footer />
        </QueryClientProvider>
      </>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/signin",
          element: <SigninPage />,
        },
        {
          path: "/signup",
          element: <SignupPage />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPasswordPage />,
        },
        {
          path: "/reset-password",
          element: <ResetPasswordPage />,
        },
        {
          path: "/account",
          element: <AccountPage />,
        },
        {
          path: "/cart",
          element: <CartPage />,
        },
        {
          path: "/category/:categoryname",
          element: <CategoryPage />,
        },
        {
          path: "/category/:categoryname/:subcategoryname",
          element: <SubCategoryPage />,
        },
        {
          path: "/product/:id",
          element: <ProductDetailsPage />,
        },

        {
          path: "/admin",
          element: <AdminPage />,
        },
        {
          path: "/add-address",
          element: <AddAddressPage />,
        },
        {
          path: "/edit-address/:addressId",
          element: <EditAddressPage />,
        },
        {
          path: "/checkout",
          element: <CheckoutPage />,
        },
        {
          path: "/payment",
          element: <PaymentPage />,
        },
        {
          path: "/payment/success",
          element: <PaymentSuccessPage />,
        },
        {
          path: "/payment/cancel",
          element: <PaymentCancelPage />,
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
      <SpeedInsights />
    </div>
  );
};
export default App;
