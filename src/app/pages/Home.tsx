import { useState, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronDown, ChevronRight, Calendar, MapPin, Target, Eye, Award, MessageSquare, BookOpen, Leaf, Users, Globe, Shield, Handshake } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { EVENTS, SERVICES, TESTIMONIALS, STATS } from "../data";
import { SectionLabel, StatusBadge } from "../components/Layout";
import Aurora from "../components/reactbits/Aurora";
import BlurText from "../components/reactbits/BlurText";
import GradientText from "../components/reactbits/GradientText";

const ICON_MAP: Record<string, React.ElementType> = { BookOpen, Leaf, Users, Globe, Shield, Handshake };

// ── Shared Animation Variants ──────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
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

// ── Hero Section (Animated Mesh & Text Reveal) ────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background pt-20">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070" className="w-full h-full object-cover opacity-60" alt="Background" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen overflow-hidden pointer-events-none">
        <Aurora colorStops={["#8B5CF6", "#C084FC", "#4C1D95"]} amplitude={1.2} />
      </div>

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] z-0 pointer-events-none" />

      <motion.div style={{ y: y1, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="mb-8 inline-flex">
          <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium tracking-widest text-zinc-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-accent inline-block mr-2 animate-pulse" />
            Transforming Communities Since 2009
          </span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.95] mb-8 text-white max-w-5xl flex flex-wrap justify-center gap-x-4 gap-y-2">
          <BlurText text="Rooting Change," delay={150} animateBy="words" direction="top" />
          <BlurText text="One Life at a Time." delay={150} animateBy="words" direction="bottom" />
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl mb-12">
          Empowering marginalized communities through skill-building, environmental action, and grassroots development.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/services" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-all active:scale-95 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">Explore Impact <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
          </Link>
          <Link to="/about" className="px-8 py-4 rounded-full border border-white/10 text-white font-bold text-lg hover:bg-white/5 transition-all">
            Our Story
          </Link>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-zinc-500">
        <span className="text-[10px] uppercase tracking-widest font-bold">Scroll Down</span>
        <div className="w-px h-12 bg-gradient-to-b from-zinc-500 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}

// ── Impact Stats (Floating Island style) ──────────────────────────────────────
function ImpactStats() {
  return (
    <section className="relative z-20 -mt-24 px-6 max-w-5xl mx-auto">
      <SpotlightCard className="p-8 backdrop-blur-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{s.value}</p>
              <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </SpotlightCard>
    </section>
  );
}

// ── Bento Grid Services ────────────────────────────────────────────────────────
function BentoServices() {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <SectionLabel>Initiatives</SectionLabel>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-white max-w-2xl">Core Programs</h2>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 lg:gap-6 auto-rows-[300px]">
          {/* Large Item */}
          <motion.div variants={fadeIn} className="md:col-span-2 md:row-span-2 h-full">
            <SpotlightCard className="h-full group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt="Environment" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-950/90 to-transparent pointer-events-none" />
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20">
                  <Leaf size={28} className="text-accent" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Environmental Action</h3>
                <p className="text-zinc-400 text-lg max-w-md mb-6 leading-relaxed">Large-scale afforestation and zero-waste initiatives aimed at creating sustainable urban ecosystems.</p>
                <Link to="/services" className="inline-flex items-center gap-2 text-white font-bold group-hover:text-accent transition-colors">
                  Read More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Regular Items */}
          {SERVICES.slice(1, 3).map((s, i) => {
            const Icon = ICON_MAP[s.icon];
            return (
              <motion.div variants={fadeIn} key={s.title} className="h-full">
                <SpotlightCard className="h-full p-8 group flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-auto border border-white/10 group-hover:bg-primary/10 transition-colors">
                    <Icon size={24} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">{s.desc}</p>
                    <Link to="/services" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 group-hover:text-white transition-colors uppercase tracking-widest">
                      Explore <ChevronRight size={12} />
                    </Link>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
            View all 6 flagship programs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Promotional Event Ads ──────────────────────────────────────────────────────
function PromotionalEventAds() {
  const upcomingAd = EVENTS.find(e => e.status === "upcoming");
  const ongoingAd = EVENTS.find(e => e.status === "ongoing");
  const completedAd = EVENTS.find(e => e.status === "completed");
  const ads = [upcomingAd, ongoingAd, completedAd].filter(Boolean) as typeof EVENTS;

  return (
    <section className="py-32 relative bg-zinc-950 border-t border-red-900/30">
      <div className="absolute inset-0 bg-red-900/5 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <SectionLabel className="!text-red-500">Sponsored Highlights</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Featured <span className="text-red-500">Campaigns</span></h2>
          </div>
          <Link to="/events" className="px-6 py-3 rounded-full border border-red-500/30 hover:bg-red-500/10 text-red-400 font-medium transition-all text-sm">
            View All Campaigns
          </Link>
        </div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ads.map(event => (
            <motion.div variants={fadeIn} key={event.id}>
              <SpotlightCard className="group cursor-pointer border border-red-900/30 hover:border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.05)] hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all">
                <div className="relative h-56 overflow-hidden">
                  <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 z-20"><StatusBadge status={event.status} /></div>
                  <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded shadow-lg tracking-widest uppercase">
                    Promoted
                  </div>
                </div>
                <div className="p-6 relative z-20 -mt-10">
                  <div className="bg-zinc-900 border border-white/10 group-hover:border-red-500/30 rounded-2xl p-5 backdrop-blur-xl shadow-2xl transition-colors">
                    <h3 className="text-white font-bold text-lg leading-snug mb-4 group-hover:text-red-400 transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-3 text-zinc-400 text-xs font-medium">
                        <Calendar size={14} className="text-red-500" /> {event.date}
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400 text-xs font-medium">
                        <MapPin size={14} className="text-red-500" /> {event.venue}
                      </div>
                    </div>
                    <Link to="/events" className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-red-600 w-full py-3 rounded-xl hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all">
                      {event.status === "completed" ? "View Impact Report" : "Register Now"}
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Donation CTA ─────────────────────────────────────────────────────────────
function DonationCTA() {
  return (
    <section className="py-40 relative overflow-hidden flex items-center justify-center">
      {/* Heavy glow background */}
      <div className="absolute inset-0 bg-black z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-primary via-accent to-primary blur-[100px] opacity-20 rounded-full animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-0 mix-blend-screen" />
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter flex items-center justify-center gap-4 flex-wrap">
          Make a <GradientText colors={["#8B5CF6", "#C084FC", "#8B5CF6"]} animationSpeed={5} showBorder={false}>Real Impact</GradientText>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-zinc-400 text-xl font-light mb-12 max-w-2xl mx-auto">
          Every contribution directly funds our grassroots initiatives. No excessive overheads, just pure impact. Eligible for 80G tax exemption.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-10 py-5 bg-white text-black font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] text-lg">
            Donate Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />
      <ImpactStats />
      <BentoServices />
      <PromotionalEventAds />
      <DonationCTA />
    </div>
  );
}
