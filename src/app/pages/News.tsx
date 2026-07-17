import { useState, useRef } from "react";
import { ArrowRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionLabel } from "../components/Layout";
import { NEWS } from "../data";

const TAGS = ["All", "Campaign", "Recognition", "Partnership", "Impact", "Community", "Environment"];

// ── Shared Animation Variants ──────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

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

export default function News() {
  const [activeTag, setActiveTag] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = NEWS.filter(n => {
    const tagMatch = activeTag === "All" || n.tag === activeTag;
    const queryMatch = !query || n.title.toLowerCase().includes(query.toLowerCase()) || n.excerpt.toLowerCase().includes(query.toLowerCase());
    return tagMatch && queryMatch;
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden flex items-center justify-center md:min-h-[60vh]">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none">
          <div className="absolute -top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_alternate]" />
        </div>
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-multiply z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center">
            <SectionLabel>Media</SectionLabel>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight leading-tight">
            News & <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Updates</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-600 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Stories from the field, campaign highlights, partnerships, and organizational milestones.
          </motion.p>
        </div>
      </section>

      <section className="py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search + Filter */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col md:flex-row gap-4 mb-16">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-11 pr-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm w-full outline-none focus:border-primary/50 focus:bg-black/10 transition-colors placeholder:text-zinc-500"
                placeholder="Search articles..." />
            </div>
            <div className="flex gap-2 flex-wrap">
              {TAGS.map(t => (
                <button key={t}
                  onClick={() => setActiveTag(t)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${activeTag === t ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(15,110,110,0.2)]" : "border-black/5 text-zinc-500 hover:text-zinc-900 hover:border-black/20 bg-black/[0.02]"}`}>
                  {t}
                </button>
              ))}
            </div>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-zinc-500 font-light">
              No articles found for your search.
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={activeTag + query} initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.2 } }} variants={staggerContainer}>
              {/* Featured */}
              {featured && (
                <motion.div variants={fadeIn} className="mb-12">
                  <SpotlightCard className="group cursor-pointer">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="h-64 lg:h-auto overflow-hidden bg-black/5 shrink-0 relative">
                        <img src={featured.img} alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                      </div>
                      <div className="p-8 lg:p-12 flex flex-col justify-center relative z-10 bg-white/80 backdrop-blur-xl lg:bg-transparent">
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-[10px] font-bold px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md uppercase tracking-widest">
                            {featured.tag}
                          </span>
                          <span className="text-xs text-zinc-500">{featured.date}</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-snug text-zinc-900 tracking-tight group-hover:text-primary transition-colors">
                          {featured.title}
                        </h2>
                        <p className="text-zinc-600 leading-relaxed text-base font-light mb-8">
                          {featured.excerpt}
                        </p>
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:translate-x-2 transition-transform">
                          Read full story <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map(n => (
                  <motion.div variants={fadeIn} key={n.id} className="h-full">
                    <SpotlightCard className="group cursor-pointer h-full flex flex-col">
                      <div className="h-48 overflow-hidden bg-black/5 shrink-0 relative">
                        <img src={n.img} alt={n.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                      </div>
                      <div className="p-4 md:p-6 flex-1 flex flex-col relative z-20">
                        <div className="bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl p-6 flex-1 flex flex-col shadow-xl">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold px-2.5 py-1 bg-black/5 border border-black/10 text-primary rounded-md uppercase tracking-widest">
                              {n.tag}
                            </span>
                            <span className="text-xs text-zinc-500">{n.date}</span>
                          </div>
                          <h3 className="font-bold text-xl leading-snug mb-3 text-zinc-900 tracking-tight group-hover:text-primary transition-colors">
                            {n.title}
                          </h3>
                          <p className="text-sm text-zinc-600 leading-relaxed font-light mb-6 flex-1 line-clamp-3">
                            {n.excerpt}
                          </p>
                          <span className="inline-flex items-center gap-2 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform mt-auto">
                            Read more <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
