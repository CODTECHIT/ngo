import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, HandCoins, TreePine, BookOpen, Users } from "lucide-react";

const STICKY_KEY = "srishree_sticky_shown";

const STICKY_NOTES = [
  {
    id: "health",
    icon: Heart,
    title: "Restore Sight",
    text: "Just ₹200 gives spectacles to a child.",
    to: "/donate",
    cta: "Give now",
    color: "bg-gradient-to-br from-amber-50 to-amber-100",
    border: "border-amber-300/60",
    colorText: "text-amber-900",
    rotate: "-rotate-2",
  },
  {
    id: "tax",
    icon: HandCoins,
    title: "80G Tax Exempt",
    text: "Every donation is tax exempt. Give today!",
    to: "/donate",
    cta: "Donate",
    color: "bg-gradient-to-br from-sky-50 to-sky-100",
    border: "border-sky-300/60",
    colorText: "text-sky-900",
    rotate: "rotate-1",
  },
  {
    id: "trees",
    icon: TreePine,
    title: "Plant a Future",
    text: "₹400 plants 5 native trees for a village.",
    to: "/donate",
    cta: "Plant trees",
    color: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    border: "border-emerald-300/60",
    colorText: "text-emerald-900",
    rotate: "-rotate-1",
  },
  {
    id: "volunteer",
    icon: Users,
    title: "Join Us",
    text: "Volunteer your time and change lives.",
    to: "/apply?category=volunteer",
    cta: "Volunteer",
    color: "bg-gradient-to-br from-rose-50 to-rose-100",
    border: "border-rose-300/60",
    colorText: "text-rose-900",
    rotate: "rotate-2",
  },
  {
    id: "education",
    icon: BookOpen,
    title: "Educate a Child",
    text: "₹500 sponsors a school kit for a student.",
    to: "/donate",
    cta: "Sponsor",
    color: "bg-gradient-to-br from-violet-50 to-violet-100",
    border: "border-violet-300/60",
    colorText: "text-violet-900",
    rotate: "-rotate-1",
  },
];

const SIDES = [
  { base: "left-4 bottom-24", align: "left" },
  { base: "right-4 bottom-40", align: "right" },
  { base: "left-6 top-28", align: "left" },
  { base: "right-6 top-24", align: "right" },
];

export function StickyNotes() {
  const [active, setActive] = useState<{ note: (typeof STICKY_NOTES)[number]; side: number } | null>(null);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STICKY_KEY)) return;

    const start = () => {
      setTimeout(() => {
        setIndex(0);
        setActive({ note: STICKY_NOTES[0], side: 0 });
      }, 1800);
    };

    if (sessionStorage.getItem("srishree_welcome_seen")) {
      start();
      return;
    }

    window.addEventListener("welcome-dismissed", start, { once: true });
    return () => window.removeEventListener("welcome-dismissed", start);
  }, []);

  useEffect(() => {
    if (!active) return;
    const hideTimer = setTimeout(() => {
      const next = index + 1;
      if (next >= STICKY_NOTES.length) {
        setActive(null);
        setDone(true);
        sessionStorage.setItem(STICKY_KEY, "1");
      } else {
        setActive({ note: STICKY_NOTES[next], side: next % SIDES.length });
        setIndex(next);
      }
    }, 7000);
    return () => clearTimeout(hideTimer);
  }, [active, index]);

  const dismiss = () => {
    setActive(null);
    setDone(true);
    sessionStorage.setItem(STICKY_KEY, "1");
  };

  const side = active ? SIDES[active.side % SIDES.length] : SIDES[0];

  return (
    <AnimatePresence>
      {active && !done && (
        <motion.div
          key={active.note.id}
          initial={{ opacity: 0, x: active.side % 2 === 0 ? -60 : 60, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className={`fixed ${side.base} z-[55] w-60 sm:w-64 rounded-lg border ${active.note.border} ${active.note.color} ${active.note.rotate} p-4 transition-shadow`}
          style={{ boxShadow: "3px 5px 0 rgba(0,0,0,0.08), 0 10px 25px rgba(0,0,0,0.12)" }}
        >
          <button
            onClick={dismiss}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-black/10 text-zinc-500 hover:text-zinc-900 hover:bg-black/5 flex items-center justify-center shadow-sm transition-colors"
            aria-label="Dismiss note"
          >
            <X size={12} />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 rounded-full bg-white/80 border border-black/5 flex items-center justify-center shadow-sm">
              <active.note.icon size={16} className="text-primary" />
            </div>
            <div className={side.align === "right" ? "text-right flex-1" : "text-left flex-1"}>
              <p className={`text-[11px] font-bold tracking-wide mb-0.5 ${active.note.colorText}`}>
                {active.note.title}
              </p>
              <p className="text-xs text-zinc-700 font-light leading-snug mb-2">
                {active.note.text}
              </p>
              <Link
                to={active.note.to}
                onClick={dismiss}
                className={`inline-block text-[11px] font-bold ${active.note.colorText} underline underline-offset-2 hover:opacity-80 transition-opacity`}
              >
                {active.note.cta} →
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
