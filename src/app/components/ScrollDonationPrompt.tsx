import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Gift, TrendingUp } from "lucide-react";

const SCROLL_KEY = "srishree_scroll_prompt_seen";

export function ScrollDonationPrompt() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SCROLL_KEY)) return;

    const onScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.45) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(SCROLL_KEY, "1");
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[55] w-[calc(100%-2rem)] max-w-md"
        >
          <div className="relative rounded-2xl bg-white border border-black/10 shadow-[0_15px_50px_rgba(0,0,0,0.2)] overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-accent to-accent-2" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={dismiss}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors"
              aria-label="Dismiss donation prompt"
            >
              <X size={16} />
            </button>

            <div className="relative p-5 flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
                className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(15,110,110,0.35)]"
              >
                <Heart size={22} className="text-white fill-white" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1 flex items-center gap-1">
                  <TrendingUp size={12} /> Liking what you see?
                </p>
                <p className="text-sm text-zinc-700 font-light leading-snug">
                  Your donation today creates real change — sight, health, education & hope.
                </p>
              </div>

              <Link
                to="/donate"
                onClick={dismiss}
                className="donate-dance donate-shine shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-[0_0_20px_rgba(15,110,110,0.35)] hover:scale-105 transition-transform"
              >
                <Gift size={14} /> Donate
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
