import { useState, useRef } from "react";
import { ArrowRight, Search, Loader2, Newspaper } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useNews, type NewsItem } from "../hooks/useNews";

const TAGS = ["All", "Campaign", "Recognition", "Partnership", "Impact", "Community", "Environment", "Announcement"];

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
function SpotlightCard({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
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
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && onClick) { e.preventDefault(); onClick(); } }}
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
  const navigate = useNavigate();
  const { news, loading } = useNews();
  const [activeTag, setActiveTag] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = news.filter(n => {
    const tagMatch = activeTag === "All" || n.tag === activeTag;
    const queryMatch = !query || n.title.toLowerCase().includes(query.toLowerCase()) || n.excerpt.toLowerCase().includes(query.toLowerCase());
    return tagMatch && queryMatch;
  });

  const [featured, ...rest] = filtered;
  const latest = news[0];

  const openArticle = (n: NewsItem) => navigate(`/news/${encodeURIComponent(String(n.id))}`);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="bg-background min-h-screen">
      {/* ── Distinctive Newsroom Header ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F6F3EC] border-b-2 border-zinc-900">
        {/* Top accent rule */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent-2 to-primary" />

        {/* Faint print texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(0deg, #18181b 0, #18181b 1px, transparent 1px, transparent 6px)` }} />

        <div className="max-w-7xl mx-auto px-6 pt-10 pb-12 md:pt-14 md:pb-16 relative z-10">
          {/* Masthead bar */}
          <div className="flex items-center justify-between gap-4 text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-zinc-600 border-y-2 border-zinc-900 py-2.5 mb-8">
            <span className="whitespace-nowrap">{today}</span>
            <span className="hidden md:block flex-1 text-center text-zinc-500">SRISHREE VISION FOUNDATION   Official Newsroom</span>
            <span className="whitespace-nowrap">India Edition</span>
          </div>

          {/* Headline block */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-[0.2em] shadow-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                  </span>
                  Live
                </span>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Breaking Stories</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="font-['Playfair_Display'] text-5xl sm:text-6xl md:text-7xl font-black text-zinc-900 leading-[1.02] tracking-tight"
              >
                News &amp; Updates
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="h-1.5 w-28 bg-gradient-to-r from-accent-2 to-accent mt-5 origin-left"
              />

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-zinc-600 text-base md:text-lg font-light leading-relaxed mt-5 max-w-xl"
              >
                Stories from the field, campaign highlights, partnerships and organizational milestones   straight from the foundation.
              </motion.p>
            </div>

            {/* Edition side card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:flex flex-col gap-3 border-2 border-zinc-900 bg-white px-6 py-5 shadow-[6px_6px_0_0_rgba(24,24,27,0.9)]"
            >
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
                <Newspaper size={16} /> Newsroom
              </div>
              <p className="text-3xl font-black text-zinc-900 font-['Playfair_Display'] leading-none">{news.length}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Stories Published</p>
              <div className="h-px bg-zinc-300" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Updated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
            </motion.div>
          </div>
        </div>

        {/* Breaking strip */}
        <div className="border-t-2 border-zinc-900 bg-zinc-950 text-white">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-[0.2em] shrink-0">Breaking</span>
            <p className="truncate font-medium text-sm text-zinc-100">
              {latest?.title || "Stories from the field, campaign highlights and organizational milestones."}
            </p>
            <ArrowRight size={16} className="text-accent shrink-0" />
          </div>
        </div>
      </section>

      {/* ── Search + Filters ─────────────────────────────────────────────────── */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col md:flex-row gap-4 mb-10">
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

          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-zinc-500 font-light">
              No articles found for your search.
            </div>
          )}

          {!loading && (
            <AnimatePresence mode="wait">
              <motion.div key={activeTag + query} initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.2 } }} variants={staggerContainer}>
                {/* Featured */}
                {featured && (
                  <motion.div variants={fadeIn} className="mb-12">
                    <SpotlightCard onClick={() => openArticle(featured)} className="group cursor-pointer">
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
                          <p className="text-zinc-600 leading-relaxed text-base font-light mb-8 line-clamp-4">
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
                      <SpotlightCard onClick={() => openArticle(n)} className="group cursor-pointer h-full flex flex-col">
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
          )}
        </div>
      </section>
    </div>
  );
}
