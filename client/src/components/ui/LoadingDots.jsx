import { motion } from "framer-motion";

const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-1 h-1 bg-light-primary rounded-full"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: dot * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export { LoadingDots };
