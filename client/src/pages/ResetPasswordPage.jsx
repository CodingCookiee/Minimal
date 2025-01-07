import { useState,  } from 'react';
import { Card, CardContent, CardHeader, Button, Input } from '../components/ui';
import { Lock ,Eye, EyeOff} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios.js';

export default function ResetPassword() {
  
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
    }
    setIsLoading(true);
    try {
        const token = new URLSearchParams(window.location.search).get('token');
        const response = await axiosInstance.post('/auth/reset-password', {
            resetToken: token,
            newPassword: password
        });
        toast.success('Password reset successfully');
        navigate('/signin');
    } catch (error) {
      console.log('Client Error Response:', error.response);
      const errorMessage = typeof error.response.data === 'string' 
        ? error.response.data 
        : error.response?.data?.message || 'Failed to reset password, please try again';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
};


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-screen bg-light-primary dark:bg-dark-primary"
    >
      <Card className="w-[400px] shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-black-100 to-neutral-400 dark:from-violet-700 dark:to-white bg-clip-text text-transparent">
            Reset Your Password
          </h1>
          <p className="text-sm text-black-500 dark:text-white-500 text-center">
            Enter your new password
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-black-500 dark:text-white-500" />
              <Input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full bg-black-100/5 dark:bg-white-500/5 border-0 focus:ring-2 ring-black-300/20 dark:ring-white-500/20"
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
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-black-500 dark:text-white-500" />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 w-full bg-black-100/5 dark:bg-white-500/5 border-0 focus:ring-2 ring-black-300/20 dark:ring-white-500/20"
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
            </div>

            <Button 
              type="submit" 
              className="w-full bg-dark-primary text-light-primary hover:text-dark-primary hover:bg-light-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}