import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { PublicAuthProvider } from "./contexts/PublicAuthContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-40 h-40 md:w-56 md:h-56 mb-8 flex items-center justify-center"
      >
        <img src="/logo.jpeg" alt="Srishreevision Foundation Logo" className="w-full h-full object-contain" />
      </motion.div>
      <div className="w-48 h-1 bg-black/5 rounded-full overflow-hidden mb-4">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-primary"
        />
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-xs md:text-sm font-bold text-zinc-400 tracking-[0.2em] uppercase text-center"
      >
        Local Vision, Global Impact
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <PublicAuthProvider>
        <AnimatePresence>
          {loading && <SplashScreen key="splash" />}
        </AnimatePresence>
        <RouterProvider router={router} />
      </PublicAuthProvider>
    </AuthProvider>
  );
}
