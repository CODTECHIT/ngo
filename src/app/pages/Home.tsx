import { useState, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronDown, ChevronRight, Calendar, MapPin, Target, Eye, Award, MessageSquare, BookOpen, Leaf, Users, Globe, Shield, Handshake, Heart } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { EVENTS, SERVICES, TESTIMONIALS, STATS } from "../data";
import { SectionLabel, StatusBadge } from "../components/Layout";
import Aurora from "../components/reactbits/Aurora";
import BlurText from "../components/reactbits/BlurText";
import GradientText from "../components/reactbits/GradientText";
import { useEvents } from "../hooks/useEvents";
import { usePrograms } from "../hooks/usePrograms";
import { useGallery } from "../hooks/useGallery";

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

// ── Hero Section (Animated Mesh & Text Reveal) ────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950 pt-20 md:pt-24 pb-10 md:pb-12">
      {/* Background Image with Ken Burns & Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 animate-ken-burns"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>

      <motion.div style={{ y: y1, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="mb-6 md:mb-8 inline-flex max-w-[90vw]">
          <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-medium tracking-widest text-white uppercase shadow-xl">
            <span className="w-2 h-2 rounded-full bg-accent inline-block mr-2 animate-pulse flex-shrink-0" />
            REGISTERED NON-PROFIT ORGANIZATION
          </span>
        </motion.div>

        <h1 className="text-[2.5rem] leading-tight sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 md:mb-8 text-white max-w-5xl text-center drop-shadow-lg mx-auto">
          <BlurText text="Empowering Communities for a Brighter Tomorrow" delay={150} animateBy="words" direction="top" className="justify-center" />
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="text-base sm:text-lg md:text-2xl text-white/90 font-light max-w-2xl mb-10 px-4 drop-shadow-md">
          Join Srishreevision Foundation in creating lasting impact through healthcare, education, and women empowerment.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto px-4 md:px-6">
          <Link to="/services" className="group w-full sm:w-auto relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-base md:text-lg hover:scale-105 transition-all active:scale-95 overflow-hidden text-center flex justify-center shadow-[0_0_20px_rgba(15,110,110,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">Our Programs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
          </Link>
          <Link to="/about" className="px-8 py-4 w-full sm:w-auto rounded-full border border-white/20 text-white font-bold text-base md:text-lg hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transition-all text-center">
            Our Story
          </Link>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 2 }} className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3 text-white/70">
        <span className="text-[10px] uppercase tracking-widest font-bold">Scroll Down</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/70 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}

// ── Impact Stats (Floating Island style) ──────────────────────────────────────
function ImpactStats() {
  const stats = [
    { label: "Lives Impacted", number: "10,000+" },
    { label: "Camps Organized", number: "500+" },
    { label: "Volunteers", number: "1,200+" },
    { label: "Years Active", number: "25+" }
  ];
  return (
    <section className="relative z-20 mt-8 px-4 md:px-6 max-w-7xl mx-auto">
      <SpotlightCard className="p-8 md:p-12 backdrop-blur-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 md:gap-12 text-center items-center justify-center">
          {stats.map((s: any, i: number) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center justify-center h-full p-2">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 mb-2 md:mb-3 tracking-tight">{s.number}</p>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-600 font-medium leading-[1.5] max-w-[120px]">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </SpotlightCard>
    </section>
  );
}

// ── About Preview ─────────────────────────────────────────────────────────────
function AboutPreview() {
  return (
    <section className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <SectionLabel>Who We Are</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-6">Our Mission & Vision</h2>
          <div className="text-zinc-600 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
            We are a registered non-profit organization dedicated to empowering communities and fostering sustainable development.
          </div>
          <Link to="/about" className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest text-sm">
            Read Our Story <ArrowRight size={16} />
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2mCijkGTMih5BfvK3XUYBjf6mljaaJ-ICXS8tnagV5KsjlbvD-PfASC4&s=10"} alt="About Us" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white text-lg md:text-xl font-medium italic">"Empowering people, changing lives."</p>
            <p className="text-white/80 mt-2 text-sm uppercase tracking-widest font-bold">— Director</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Bento Grid Services ────────────────────────────────────────────────────────
function BentoServices() {
  const { programs } = usePrograms();
  
  const displayPrograms = programs.length > 0 ? programs.map(p => ({
    title: p.title,
    desc: p.description,
    icon: ICON_MAP[p.icon_name] || Heart,
    img: (p.image_url || '').split(',')[0]
  })) : [
    {
      title: "Health & Eye Care",
      desc: "Free eye check-up camps, spectacle distribution, blood donation drives, and community health awareness programs.",
      icon: Heart,
      img: "https://archive.cehjournal.org/wp-content/uploads/2013/04/5591589853_b254109a50_o.jpg"
    },
    {
      title: "Education & Skill Development",
      desc: "Supporting youth with skill-building programs and awareness on safe agricultural and health practices.",
      icon: BookOpen,
      img: "https://srdsindia.org/wp-content/uploads/2021/09/teaching.jpeg"
    },
    {
      title: "Women Empowerment",
      desc: "Programs focused on confidence, self-sufficiency, and community participation for women.",
      icon: Users,
      img: "https://images.deccanchronicle.com/dc-Cover-evutgf5c1ji9f3bioadrrd1q22-20170307231336.Medi.jpeg"
    },
    {
      title: "Community & Rural Development",
      desc: "Drug-awareness programs, polio awareness drives, and rural outreach in partnership with local police and Lions Club.",
      icon: Globe,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrcFs-CJGepmn6IPdXItKuRt3EYDhm26uOQSb4Dnxt8awYzyYB_zzxtQyB&s=10"
    }
  ];

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <SectionLabel>Initiatives</SectionLabel>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6 text-zinc-900 max-w-2xl">Core Programs</h2>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {displayPrograms.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div variants={fadeIn} key={s.title} className="h-full">
                <SpotlightCard className="h-full group flex flex-col bg-white overflow-hidden p-0 border border-black/10 hover:border-black/20">
                  <div className="relative h-48 md:h-56 w-full shrink-0 overflow-hidden bg-black/5">
                    <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg border border-black/5">
                      <Icon size={18} className="text-primary group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-zinc-900 mb-3">{s.title}</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">{s.desc}</p>
                    <Link to="/services" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 group-hover:text-zinc-900 transition-colors uppercase tracking-widest mt-auto">
                      Explore <ChevronRight size={12} />
                    </Link>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
            View all our programs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Promotional Event Ads ──────────────────────────────────────────────────────
function PromotionalEventAds() {
  const { events } = useEvents();

  const ads = events.length > 0 ? events.slice(0, 3) : [
    {
      id: "1",
      title: "Mega Health Camp 2026",
      image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      event_date: "2026-08-15",
      location: "Community Hall, Alwal",
      status: "upcoming" as const,
      show_register_button: true,
    },
    {
      id: "2",
      title: "Women Empowerment Workshop",
      image_url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
      event_date: "2026-09-10",
      location: "ZPHS School, Tirumalagiri",
      status: "upcoming" as const,
      show_register_button: true,
    },
    {
      id: "3",
      title: "Rural Education Drive",
      image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
      event_date: "2026-05-20",
      location: "Government School, Medchal",
      status: "completed" as const,
      show_register_button: false,
    }
  ];

  return (
    <section className="py-12 md:py-24 relative bg-background border-t border-black/5">
      <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <SectionLabel>Key Initiatives</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">Featured <span className="text-primary">Campaigns</span></h2>
          </div>
          <Link to="/events" className="px-6 py-3 rounded-full border border-black/10 hover:bg-black/5 text-zinc-600 hover:text-zinc-900 font-medium transition-all text-sm">
            View All Campaigns
          </Link>
        </div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {ads.map(event => (
            <motion.div variants={fadeIn} key={event.id} className="h-full">
              <SpotlightCard className="h-full group cursor-pointer border border-black/5 hover:border-black/20 shadow-[0_0_15px_rgba(0,0,0,0.02)] hover:shadow-[0_0_30px_rgba(0,0,0,0.08)] transition-all bg-white flex flex-col p-0 overflow-hidden">
                <div className="relative h-56 shrink-0 w-full bg-black/5 overflow-hidden">
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 z-20"><StatusBadge status={event.status === 'upcoming' ? 'upcoming' : 'completed'} /></div>
                </div>
                <div className="p-4 md:p-6 relative z-20 flex flex-col flex-1">
                  <div className="bg-white border border-black/5 group-hover:border-black/10 rounded-2xl p-5 shadow-lg transition-colors flex flex-col flex-1">
                    <h3 className="text-zinc-900 font-bold text-lg leading-snug mb-4 group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3 text-zinc-600 text-xs font-medium">
                        <Calendar size={14} className="text-primary shrink-0 mt-0.5" /> 
                        <span>{event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBD'}</span>
                      </div>
                      <div className="flex items-start gap-3 text-zinc-600 text-xs font-medium">
                        <MapPin size={14} className="text-primary shrink-0 mt-0.5" /> 
                        <span className="line-clamp-2">{event.location || 'TBA'}</span>
                      </div>
                    </div>
                    {event.status === "upcoming" && event.show_register_button ? (
                      <Link to="/events" className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-primary w-full py-3 rounded-xl hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(15,110,110,0.3)] transition-all mt-auto">
                        Register Now
                      </Link>
                    ) : event.status === "completed" ? (
                      <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-zinc-400 bg-black/5 w-full py-3 rounded-xl mt-auto cursor-not-allowed uppercase tracking-wider border border-black/5">
                        Completed
                      </div>
                    ) : (
                      <div className="mt-auto"></div>
                    )}
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
// ── Gallery Preview ───────────────────────────────────────────────────────────
function GalleryPreview() {
  const { images, loading } = useGallery();
  
  const displayImages = images.slice(0, 4);

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <SectionLabel>Impact in Action</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">Our Gallery</h2>
        </div>
        <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
          View full gallery <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayImages.length > 0 ? (
          displayImages.map((img, i) => {
            const isVideo = img.image_url?.match(/\.(mp4|webm)$/i) || img.image_url?.includes('/video/upload/');
            return (
              <motion.div 
                key={img.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl overflow-hidden bg-black/5 shadow-sm group aspect-square ${i === 0 || i === 3 ? 'md:col-span-2 md:aspect-video' : ''}`}
              >
                {isVideo ? (
                  <video src={img.image_url} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <img src={img.image_url} alt={img.caption || "Gallery item"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
              </motion.div>
            );
          })
        ) : !loading ? (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-black/5 rounded-2xl">
            There are no photos or videos available in the gallery yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}

// ── Donation CTA ─────────────────────────────────────────────────────────────
function DonationCTA() {
  return (
    <section className="py-40 relative overflow-hidden flex items-center justify-center">
      {/* Heavy glow background */}
      <div className="absolute inset-0 bg-white z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-primary via-accent to-primary blur-[100px] opacity-20 rounded-full animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-0 mix-blend-multiply" />
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-5xl md:text-7xl font-bold text-zinc-900 mb-8 tracking-tight leading-tight flex items-center justify-center gap-4 flex-wrap">
          Make a <GradientText colors={["#0F6E6E", "#4CAF50", "#0F6E6E"]} animationSpeed={5} showBorder={false}>Real Impact</GradientText>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-zinc-600 text-xl font-light mb-12 max-w-2xl mx-auto">
          Every contribution directly funds our grassroots initiatives. No excessive overheads, just pure impact. Eligible for 80G tax exemption.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-10 py-5 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(15,110,110,0.3)] text-lg">
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
      <AboutPreview />
      <BentoServices />
      <PromotionalEventAds />
      <GalleryPreview />
      <DonationCTA />
    </div>
  );
}
