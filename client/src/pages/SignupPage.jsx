import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import SignUp from '../components/Auth/SignUp';
import axiosInstance from '../utils/axios';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth state
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignup = async (formData) => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/signup', formData);
      toast.success(data.message || 'Welcome to Minimal!');
      navigate('/signin');
    } catch (error) {
      const errorMessage = typeof error.response.data === 'string' 
        ? error.response.data 
        : error.response.data?.message || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading || isLoading) {
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

  return <SignUp onSubmit={handleSignup} isLoading={isLoading} />;
}
