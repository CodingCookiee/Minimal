import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SignUp from "../components/Auth/SignUp";

export default function SignUpPage() {
  const [authStatus, setAuthStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = document.cookie.includes("accessToken");
    if (accessToken) {
      setAuthStatus("authenticated");
      navigate("/");
    } else {
      setAuthStatus("unauthenticated");
    }
  }, [navigate]);

  if (authStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light-primary dark:bg-dark-primary">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-black-300 dark:border-white-700 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (authStatus === "authenticated") {
    return null;
  }

  return <SignUp />;
}
