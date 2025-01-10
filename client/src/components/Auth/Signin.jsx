import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Card } from "../ui";
import { ArrowRight, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios.js";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password to signin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const { data } = await axiosInstance.post("/auth/signin", formData);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Welcome back to Minimal");
      navigate("/");
    } catch (error) {
      console.log("Client Error Response:", error.response);
      const errorMessage =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data.message || "Invalid credentials";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await axiosInstance.post("/auth/google", {
          token: tokenResponse.access_token,
        });

        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Welcome to Minimal!");
        navigate("/");
      } catch (error) {
        toast.error("Google authentication failed");
      }
    },
    onError: () => {
      toast.error("Google authentication failed");
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=" mt-10 h-screen flex items-center justify-center bg-light-primary dark:bg-dark-primary px-4"
    >
      <Card className="w-full border-none max-w-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-black-100 to-black-300 dark:from-white-700 dark:to-white bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-black-500 dark:text-white-500 mt-2">
              Signin to Continue Shopping
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`pl-10 w-full border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`pl-10 w-full border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent ${errors.password ? "border-red-500" : ""}`}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-black-500 dark:text-white-500 hover:text-violet-300 dark:hover:text-violet-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end text-sm text-gray-700 	">
              <Link to="/forgot-password">forgot password?</Link>
            </div>
            <div className="flex justify-center w-full ">
              <Button
                type="submit"
                className=" w-1/2 font-sf-medium rounded-none bg-dark-primary text-light-primary hover:bg-light-primary hover:text-dark-primary transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center"
                  >
                    <div className="h-5 w-5 border-2 border-white dark:border-black-200 border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </motion.div>
                ) : (
                  <span className="flex items-center justify-center">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black-300/10 dark:border-white-500/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-dark-primary text-black-500 dark:text-white-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex justify-center w-full ">
            <Button
              type="button"
              variant="outline"
              onClick={() => googleLogin()}
              className=" border-none w-1/2 font-sf-medium rounded-none bg-light-primary text-dark-primary hover:bg-dark-primary hover:text-light-primary transition-all duration-300"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Google
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-black-500 dark:text-white-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-black-300 dark:text-white-700 hover:text-neutral-500"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
