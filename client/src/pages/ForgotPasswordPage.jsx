import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { Card, Button, Input, CardContent, CardHeader } from "../components/ui";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axios.js";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});


  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      if (response?.data) {
        toast.success("Reset link sent to your email");
      }
    } catch (error) {
      console.log("Client Error Response:", error.response);
      const errorMessage =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data?.message ||
            "Failed to send reset link, please try again";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=" flex items-center justify-center h-screen min-h-screen "
    >
      <Card className="w-[400px] ">
        <CardHeader>
          <h1 className="text-3xl font-sf-heavy font-bold text-center bg-gradient-to-r from-black-100 to-neutral-400 dark:from-violet-700 dark:to-white bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-sm text-black-500 dark:text-white-500 text-center">
            Enter your email to receive a reset link
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-black-500 dark:text-white-500" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 w-full border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent ${errors.email ? "border-red-500" : ""}`}
                required
              />
              <small className="text-red-500">{errors.email}</small>
            </div>

            <Button
              type="submit"
              className="!mt-7 w-full font-sf-medium rounded-none bg-dark-primary text-light-primary hover:text-dark-primary hover:bg-light-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center"
                >
                  <div className="h-5 w-5 border-2 border-white dark:border-black-200 border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </motion.div>
              ) : (
                <span className="flex items-center justify-center">
                  Send Reset Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ForgotPasswordPage;
