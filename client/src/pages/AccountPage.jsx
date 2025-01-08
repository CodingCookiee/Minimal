import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axios.js';
import { motion, AnimatePresence } from 'framer-motion';

const AccountPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    return (
        <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 , y: -20 }}
        className="min-h-screen flex items-center justify-center "
        >
            
        </motion.div>
    );
}

export default AccountPage;
