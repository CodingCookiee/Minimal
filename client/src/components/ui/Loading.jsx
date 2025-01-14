import { motion, AnimatePresence } from "framer-motion";

export const Loading = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-screen"
      >
        <motion.div
          className="w-16 h-16 border-[3px] border-t-4 border-dark-primary rounded-full"
          style={{
            borderColor: "#1C1C21",
            borderTopColor: "#edff66", 
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};
