import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Heart, X, Gift, Sparkles } from "lucide-react";

const STORAGE_KEY = "srishree_welcome_seen";

export function WelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
    window.dispatchEvent(new CustomEvent("welcome-dismissed"));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-accent to-accent-2" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={dismiss}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-colors"
              aria-label="Close welcome message"
            >
              <X size={18} />
            </button>

            <div className="relative p-8 pt-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.2 }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(15,110,110,0.4)]"
              >
                <Heart size={36} className="text-white fill-white" />
              </motion.div>

              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-3">
                <Sparkles size={12} /> Welcome
              </span>

              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-3 tracking-tight">
                Welcome to Srishreevision Foundation
              </h2>

              <p className="text-sm md:text-base text-zinc-600 font-light leading-relaxed mb-2">
                Namaste and a very warm welcome! We are glad to have you here.
              </p>
              <p className="text-sm md:text-base text-zinc-600 font-light leading-relaxed mb-6">
                Your kindness can bring <span className="font-medium text-primary">sight, health, education, and hope</span> to those who need it most. Will you join us in making a real difference today?
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  to="/donate"
                  onClick={dismiss}
                  className="donate-dance donate-shine inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold shadow-[0_0_25px_rgba(15,110,110,0.35)] hover:shadow-[0_0_40px_rgba(76,175,80,0.5)] hover:scale-[1.02] transition-all"
                >
                  <Gift size={18} /> Donate Now
                </Link>
                <button
                  onClick={dismiss}
                  className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition-colors py-1"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
