import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Calendar, MapPin, Users, Clock, ArrowRight, X, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionLabel, StatusBadge } from "../components/Layout";
import Aurora from "../components/reactbits/Aurora";
import BlurText from "../components/reactbits/BlurText";
import GradientText from "../components/reactbits/GradientText";
import { useEvents, Event } from "../hooks/useEvents";
import { usePublicAuth } from "../contexts/PublicAuthContext";
import { supabase } from "../../lib/supabase";

type Filter = "all" | "upcoming" | "completed";

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
      className={`relative overflow-hidden rounded-3xl border border-black/5 bg-black/[0.02] shadow-2xl transition-all duration-500 hover:border-black/20 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(15,110,110,0.1), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

function RegistrationModal({ event, onClose, onRegisterSuccess }: { event: Event; onClose: () => void, onRegisterSuccess: (eventId: string) => void }) {
  const { user } = usePublicAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1: Form, 2: Payment (if not free)

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    location: '',
    from_address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('event_registrations').insert({
        event_id: event.id,
        user_id: user ? user.id : null,
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        location: formData.location,
        from_address: formData.from_address,
        status: event.is_free ? 'registered' : 'paid'
      });
      if (error) {
        throw error;
      }
      onRegisterSuccess(event.id);
      onClose();
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (event.is_free) {
      handleRegister();
    } else {
      setStep(2);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white border border-black/10 rounded-3xl shadow-2xl w-full max-w-xl p-8 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
          
          <button onClick={onClose}
            className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-900 transition-colors bg-black/5 rounded-full p-2 border border-black/10 z-20">
            <X size={16} />
          </button>
          
          <h2 className="text-3xl font-bold mb-2 tracking-tight text-zinc-900 relative z-10">Register</h2>
          <p className="text-sm text-primary mb-8 font-medium relative z-10">{event.title} {event.is_free ? "(Free)" : `(₹${event.price})`}</p>
          
          <div className="relative z-10">
            {step === 1 ? (
              <form onSubmit={onSubmitForm} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-600 uppercase mb-1 block">Full Name</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-600 uppercase mb-1 block">Mobile Number</label>
                    <input required name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-600 uppercase mb-1 block">Email Address</label>
                  <input required name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-600 uppercase mb-1 block">Location</label>
                    <input required name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-600 uppercase mb-1 block">From Address</label>
                    <input required name="from_address" value={formData.from_address} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 mt-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(15,110,110,0.3)] disabled:opacity-50">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : (event.is_free ? "Confirm Registration" : "Proceed to Payment")}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-4">Complete Your Payment</h3>
                <p className="text-zinc-600 mb-8">Amount to pay: ₹{event.price}</p>
                <button
                  disabled={loading}
                  onClick={handleRegister}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#02042B] text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Pay with Razorpay (Placeholder)"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function Events() {
  const { events, loading } = useEvents();
  const { user } = usePublicAuth();
  const navigate = useNavigate();
  
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // The previous implementation used user.id to check registration.
    // For this new flow (with name, mobile, etc), we might want to check by a local storage list 
    // or just not show "Registered" unless we tie it to auth again.
    // Given the prompt, users can register with their email. We'll simplify and not show "Registered" 
    // or check it locally if they aren't logged in, but we can leave the registered list empty for now.
    setRegisteredEventIds(new Set());
  }, []);

  const filteredEvents = filter === "all" ? events : events.filter(e => e.status === filter);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-6 relative overflow-hidden flex items-center justify-center">
        {/* React Bits Aurora Background */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-multiply">
          <Aurora colorStops={["#0F6E6E", "#29B6F6", "#4CAF50"]} amplitude={1.2} />
        </div>
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-multiply z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center">
            <SectionLabel>Get Involved</SectionLabel>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight leading-tight flex items-center justify-center gap-4 flex-wrap">
            <BlurText text="Events &" delay={150} animateBy="words" direction="top" />
            <GradientText colors={["#0F6E6E", "#4CAF50", "#0F6E6E"]} animationSpeed={5} showBorder={false}>Programs</GradientText>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-600 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Join us on the ground — from plantation drives to leadership summits, there is always a way to make a difference.
          </motion.p>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-3 mb-16">
            {(["all", "upcoming", "completed"] as Filter[]).map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold capitalize transition-all border ${filter === f ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(15,110,110,0.1)]" : "border-black/5 text-zinc-500 hover:text-zinc-900 hover:border-black/20 bg-black/[0.02]"}`}>
                {f}
              </button>
            ))}
          </motion.div>
          
          <motion.div 
            key={filter}
            initial="hidden" animate="visible" variants={staggerContainer} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
                <div className="col-span-3 flex justify-center text-primary py-20"><Loader2 className="animate-spin w-8 h-8" /></div>
            ) : filteredEvents.length === 0 ? (
                <div className="col-span-3 text-center text-zinc-600 py-20">No events found for this category.</div>
            ) : (
                filteredEvents.map((ev: Event) => {
                    const isRegistered = registeredEventIds.has(ev.id);
                    
                    return (
                    <motion.div variants={fadeIn} key={ev.id} className="h-full">
                        <SpotlightCard className="group h-full flex flex-col">
                        <div className="relative h-56 overflow-hidden bg-black/5 shrink-0">
                            {ev.image_url ? (
                              <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">No Image</div>
                            )}
                            <div className="absolute top-4 left-4 flex gap-2 z-10">
                                <StatusBadge status={ev.status} />
                            </div>
                        </div>
                        
                        <div className="p-4 md:p-6 flex-1 flex flex-col relative z-20">
                            <div className="bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl p-6 flex-1 flex flex-col shadow-xl">
                            <div className="inline-block mb-3">
                                <span className="bg-black/5 border border-black/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">
                                Event
                                </span>
                            </div>
                            <h3 className="font-bold text-xl text-zinc-900 leading-snug mb-4 group-hover:text-primary transition-colors tracking-tight line-clamp-2">
                                {ev.title}
                            </h3>
                            
                            <div className="space-y-2.5 mb-6 flex-1">
                                <span className="flex items-center gap-3 text-xs text-zinc-600 font-medium">
                                <Calendar size={14} className="text-accent shrink-0" /> {new Date(ev.event_date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-3 text-xs text-zinc-600 font-medium">
                                <MapPin size={14} className="text-accent shrink-0" /> {ev.location}
                                </span>
                            </div>
                            
                            <p className="text-sm text-zinc-600 leading-relaxed font-light mb-6 line-clamp-3">
                                {ev.description}
                            </p>
                            
                            {ev.show_register_button && ev.status === 'upcoming' && (
                                <div className="pt-5 border-t border-black/10 mt-auto">
                                  {isRegistered ? (
                                    <button disabled className="w-full flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl">
                                      <CheckCircle2 size={16} /> Registered
                                    </button>
                                  ) : (
                                    <button
                                        onClick={() => {
                                          if (!user) {
                                            navigate('/login');
                                          } else {
                                            setSelectedEvent(ev);
                                          }
                                        }}
                                        className="w-full flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:shadow-[0_0_15px_rgba(15,110,110,0.4)] hover:scale-105 transition-all">
                                        Register <ArrowRight size={16} />
                                    </button>
                                  )}
                                </div>
                            )}
                            </div>
                        </div>
                        </SpotlightCard>
                    </motion.div>
                )})
            )}
          </motion.div>
        </div>
      </section>

      {/* Registration modal */}
      {selectedEvent && (
        <RegistrationModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          onRegisterSuccess={(id) => {
            setRegisteredEventIds(prev => new Set(prev).add(id));
          }}
        />
      )}
    </div>
  );
}
