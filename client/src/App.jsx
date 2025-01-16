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
import MenPage from "./pages/categories/MenPage";
import WomenPage from "./pages/categories/WomenPage";
import SalePage from "./pages/categories/SalePage";
import MenJeansPage from "./pages/categories/men/MenJeansPage";
import MenShirtsPage from "./pages/categories/men/MenShirtsPage";
import WomenJeansPage from "./pages/categories/women/WomenJeansPage";
import WomenShirtsPage from "./pages/categories/women/WomenShirtsPage";
import WomenTrousersPage from "./pages/categories/women/WomenTrousersPage";
import MenSalePage from "./pages/categories/sale/MenSalePage";
import WomenSalePage from "./pages/categories/sale/WomenSalePage";


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
          path: "/category/:category",
          element: <CategoryPage />,
        },
        {
          path: "/men",
          element: <MenPage />,
        },
        {
          path: "/men/jeans",
          element: <MenJeansPage />,
        },
        {
          path: "/men/shirts",
          element: <MenShirtsPage />,
        },
        {
          path: "/women",
          element: <WomenPage />,
        },
        {
          path: "/women/jeans",
          element: <WomenJeansPage />,
        },
        {
          path: "/women/shirts",
          element: <WomenShirtsPage />,
        },
        {
          path: "/women/trousers",
          element: <WomenTrousersPage />,
        },
        {
          path: "/sales",
          element: <SalePage />,
        },
        {
          path: "/sales/men",
          element: <MenSalePage />,
        },
        {
          path: "/sales/women",
          element: <WomenSalePage />,
        },
        
        {
          path: "/admin",
          element: <AdminPage />,
        },
        {
          path: "/checkout",
          element: <CheckoutPage />,
        },
        {
          path: "/payment/success",
          element: <PaymentSuccessPage />,
        },
        {
          path: "/payment/cancel",
          element: <PaymentCancelPage />,
        },
        {
          path: "/add-address",
          element: <AddAddressPage />,
        },
        {
          path: "/edit-address/:addressId",
          element: <EditAddressPage />,
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
