import { useState, useRef, useEffect } from "react";
import { Calendar, MapPin, Users, Clock, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionLabel, StatusBadge } from "../components/Layout";
import { api } from "../api";
import Aurora from "../components/reactbits/Aurora";
import BlurText from "../components/reactbits/BlurText";
import GradientText from "../components/reactbits/GradientText";

type Filter = "all" | "upcoming" | "ongoing" | "completed";

// ── Shared Animation Variants ──────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// ── UI Components ─────────────────────────────────────────────────────────────

// Spotlight Card: Glow follows mouse hover
function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] shadow-2xl transition-all duration-500 hover:border-white/20 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139,92,246,0.15), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

function RegistrationModal({ event, onClose }: { event: any; onClose: () => void }) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden"
        >
          {/* Subtle glow behind modal */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
          
          <button onClick={onClose}
            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-full p-2 border border-white/10">
            <X size={16} />
          </button>
          
          <h2 className="text-3xl font-bold mb-2 tracking-tight text-white">Register</h2>
          <p className="text-sm text-primary mb-8 font-medium">{event.title}</p>
          
          <div className="space-y-5 relative z-10">
            <button
              onClick={async () => {
                try {
                  await api.registerForEvent(event._id);
                  alert("Successfully registered!");
                  onClose();
                } catch (err: any) {
                  alert(err.message || "Failed to register. Please log in first.");
                }
              }}
              className="w-full py-4 mt-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              Confirm Registration
            </button>
            <p className="text-[11px] text-center text-zinc-500 font-light mt-4">
              Confirmation will be sent via email & WhatsApp within 24 hours.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function Events() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvents()
      .then(res => setEvents(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = filter === "all" ? events : events.filter(e => e.status === filter);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 md:px-6 relative overflow-hidden flex items-center justify-center">
        {/* React Bits Aurora Background */}
        <div className="absolute inset-0 z-0 opacity-60 pointer-events-none mix-blend-screen">
          <Aurora colorStops={["#8B5CF6", "#C084FC", "#4C1D95"]} amplitude={1.2} />
        </div>
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center">
            <SectionLabel>Get Involved</SectionLabel>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight flex items-center justify-center gap-4 flex-wrap">
            <BlurText text="Events &" delay={150} animateBy="words" direction="top" />
            <GradientText colors={["#8B5CF6", "#C084FC", "#8B5CF6"]} animationSpeed={5} showBorder={false}>Programs</GradientText>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Join us on the ground — from plantation drives to leadership summits, there is always a way to make a difference.
          </motion.p>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-3 mb-16">
            {(["all", "upcoming", "ongoing", "completed"] as Filter[]).map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold capitalize transition-all border ${filter === f ? "bg-white/10 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "border-white/5 text-zinc-500 hover:text-white hover:border-white/20 bg-white/[0.02]"}`}>
                {f}
              </button>
            ))}
          </motion.div>
          
          <motion.div 
            key={filter}
            initial="hidden" animate="visible" variants={staggerContainer} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
                <div className="col-span-3 text-center text-zinc-400 py-20">Loading events...</div>
            ) : filteredEvents.length === 0 ? (
                <div className="col-span-3 text-center text-zinc-400 py-20">No events found for this category.</div>
            ) : (
                filteredEvents.map((ev: any) => (
                    <motion.div variants={fadeIn} key={ev._id} className="h-full">
                        <SpotlightCard className="group h-full flex flex-col">
                        <div className="relative h-56 overflow-hidden bg-zinc-900 shrink-0">
                            <img src={ev.banner} alt={ev.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 flex gap-2 z-10">
                            <StatusBadge status={ev.status} />
                            </div>
                        </div>
                        
                        <div className="p-4 md:p-6 flex-1 flex flex-col relative z-20">
                            <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex-1 flex flex-col shadow-xl">
                            <div className="inline-block mb-3">
                                <span className="bg-white/5 border border-white/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">
                                {ev.category}
                                </span>
                            </div>
                            <h3 className="font-bold text-xl text-white leading-snug mb-4 group-hover:text-primary transition-colors tracking-tight">
                                {ev.title}
                            </h3>
                            
                            <div className="space-y-2.5 mb-6 flex-1">
                                <span className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                                <Calendar size={14} className="text-accent shrink-0" /> {ev.date}
                                </span>
                                <span className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                                <MapPin size={14} className="text-accent shrink-0" /> {ev.venue}
                                </span>
                                <span className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                                <Clock size={14} className="text-accent shrink-0" /> Deadline: {ev.deadline}
                                </span>
                            </div>
                            
                            <p className="text-sm text-zinc-500 leading-relaxed font-light mb-6 line-clamp-3">
                                {ev.desc}
                            </p>
                            
                            <div className="flex items-center justify-between pt-5 border-t border-white/10 mt-auto">
                                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                                <Users size={14} className="text-zinc-600" />
                                {ev.seats > 0 ? <span className="text-white">{ev.seats} seats left</span> : "Completed"}
                                </div>
                                {ev.status !== "completed" && (
                                <button
                                    onClick={() => setSelectedEvent(ev)}
                                    className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 bg-white text-black rounded-xl hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:scale-105 transition-all">
                                    Register <ArrowRight size={14} />
                                </button>
                                )}
                            </div>
                            </div>
                        </div>
                        </SpotlightCard>
                    </motion.div>
                ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Registration modal */}
      {selectedEvent && <RegistrationModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}
