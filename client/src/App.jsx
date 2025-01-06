import ScrollToTop from "./components/ui/ScrollToTop";
import HomePage from "./pages/HomePage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
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
          path : "/signup",
          element : <SignupPage />
        }
        
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