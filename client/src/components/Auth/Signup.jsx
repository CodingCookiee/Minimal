import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../ui';
import { Chrome, ArrowRight, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios.js';
import { useGoogleLogin } from '@react-oauth/google';


export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters (!@#$%^&*)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/signup', formData);
      if (response && response.data) {
        toast.success('Welcome to Minimal!');
        navigate('/signin');
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors;
        errorMessages.forEach((errorMessage) => {
          toast.error(errorMessage);
        });
        setErrors(prev => ({
          ...prev,
          ...errorMessages.reduce((acc, errorMessage) => {
            const [field, message] = errorMessage.split(': ');
            acc[field] = message;
            return acc;
          }, {})
        }));
      } else {
        const errorMessage = typeof error.response?.data?.message === 'string' ? error.response.data.message : 'Signup Failed, please try again later';
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await axiosInstance.post('/auth/google', {
          token: tokenResponse.access_token
        });
        toast.success('Welcome to Minimal!');
        navigate('/');
      } catch (error) {
        toast.error('Google authentication failed');
      }
    },
    onError: () => {
      toast.error('Google authentication failed');
    }
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-light-primary dark:bg-dark-primary px-4"
    >
      <Card className="w-full max-w-md bg-white dark:bg-dark-primary border border-black-300/10 dark:border-white-500/10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-black-100 to-black-300 dark:from-white-700 dark:to-white bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-black-500 dark:text-white-500 mt-2">
              Start your journey with Minimal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
              <Input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`pl-10 w-full ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`pl-10 w-full ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-black-500 dark:text-white-500" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={`pl-10 w-full ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-black-500 dark:text-white-500 hover:text-light-accent dark:hover:text-dark-accent"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
            </div>

            <Button 
  type="submit" 
  className="w-full bg-black-200 hover:bg-black-300 dark:bg-white text-white dark:text-black-200 
    dark:hover:bg-white-800 transition-all duration-300 rounded-xl py-3"
  disabled={isLoading}
>
  {isLoading ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center"
    >
      <div className="h-5 w-5 border-2 border-white dark:border-black-200 border-t-transparent rounded-full animate-spin mr-2" />
      Creating account...
    </motion.div>
  ) : (
    <span className="flex items-center justify-center">
      Get Started
      <ArrowRight className="ml-2 h-4 w-4" />
    </span>
  )}
</Button>

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

          <Button
            type="button"
            variant="outline"
            onClick={() => googleLogin()}
            className="w-full bg-black-100/5 dark:bg-white-500/5 hover:bg-black-100/10 dark:hover:bg-white-500/10 
              text-black-300 dark:text-white-700 transition-all duration-300 rounded-xl py-3"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Google
          </Button>

          <p className="mt-6 text-center text-sm text-black-500 dark:text-white-500">
            Already have an account?{' '}
            <Link 
              to="/signin" 
              className="font-medium text-black-300 dark:text-white-700 hover:text-light-accent dark:hover:text-dark-accent"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
