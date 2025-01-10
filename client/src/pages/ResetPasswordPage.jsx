import { useState } from "react";
import { Card, CardContent, CardHeader, Button, Input } from "../components/ui";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios.js";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Check for empty fields
    if (!password || !confirmPassword) {
      newErrors.password = "Both password fields are required";
      setErrors(newErrors);
      return false;
    }
  
    // Password length check
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      setErrors(newErrors);
      return false;
    }
  
    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      setErrors(newErrors);
      return false;
    }
  
    // Password match check
    if (password !== confirmPassword) {
      newErrors.password = "Passwords do not match";
      setErrors(newErrors);
      return false;
    }
  
    setErrors({});
    return true;
  };
  
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const token = new URLSearchParams(window.location.search).get("token");
      const response = await axiosInstance.post("/auth/reset-password", {
        resetToken: token,
        newPassword: password,
      });
      toast.success("Password reset successfully");
      navigate("/signin");
    } catch (error) {
      console.log("Client Error Response:", error.response);
      const errorMessage =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            "Failed to reset password, please try again";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-screen bg-transparent"
    >
      <Card className="w-[400px] ">
        <CardHeader>
          <h1 className="text-3xl font-sf-heavy font-bold text-center bg-gradient-to-r from-black-100 to-neutral-400 dark:from-violet-700 dark:to-white bg-clip-text text-transparent">
            Reset Your Password
          </h1>
          <p className="text-sm text-black-500 dark:text-white-500 text-center">
            Enter your new password
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-black-500 dark:text-white-500" />
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-10 w-full border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent ${errors.password ? "border-red-500" : ""}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3.5 text-black-500 dark:text-white-500 hover:text-violet-300 dark:hover:text-violet-300 transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              <small className="text-red-500">{errors.password}</small>
            </div>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-black-500 dark:text-white-500" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pl-10 w-full border-t-0 border-l-0 border-r-0 border-b border-black-300 rounded-none focus:border-2 outline-none focus:ring-transparent ${errors.password ? "border-red-500" : ""}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-black-500 dark:text-white-500 hover:text-violet-300 dark:hover:text-violet-300 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              <small className="text-red-500">{errors.password}</small>
            </div>

            <Button
              type="submit"
              className="w-full font-sf-medium rounded-none bg-dark-primary text-light-primary hover:text-dark-primary hover:bg-light-primary"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
