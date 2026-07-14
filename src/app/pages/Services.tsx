import { ArrowRight, BookOpen, Leaf, Users, Globe, Shield, Handshake, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { SectionLabel } from "../components/Layout";
import { SERVICES } from "../data";
import Aurora from "../components/reactbits/Aurora";
import BlurText from "../components/reactbits/BlurText";
import GradientText from "../components/reactbits/GradientText";

const ICON_MAP: Record<string, React.ElementType> = { BookOpen, Leaf, Users, Globe, Shield, Handshake };

const EXTRA_INFO: Record<string, string[]> = {
  "Skill Development": ["Free certification upon completion", "Placement assistance provided", "Industry-aligned curriculum", "Available in 14 cities"],
  "Environmental Awareness": ["1.2M saplings planted to date", "220 Green Schools enrolled", "80+ municipal partnerships", "Annual drives in 9 states"],
  "Women Empowerment": ["3,200 active SHG members", "Micro-finance linkages", "Free legal aid camps", "Business incubation support"],
  "Community Development": ["140+ projects completed", "Solar lighting & sanitation", "Co-designed with residents", "Government scheme integration"],
  "Social Welfare": ["18,000 nutrition packets/month", "4 shelter homes operated", "2 old-age care centres", "Emergency relief network"],
  "Training Workshops": ["450+ workshops annually", "38,000+ participants", "All workshops free of charge", "Expert facilitators"],
};

// ── Shared Animation Variants ──────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function Services() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden flex items-center justify-center">
        {/* React Bits Aurora Background */}
        <div className="absolute inset-0 z-0 opacity-60 pointer-events-none mix-blend-screen">
          <Aurora colorStops={["#8B5CF6", "#C084FC", "#4C1D95"]} amplitude={1.2} />
        </div>
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center">
            <SectionLabel>Programs</SectionLabel>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter flex items-center justify-center gap-4 flex-wrap">
            <BlurText text="Our" delay={150} animateBy="words" direction="top" />
            <GradientText colors={["#8B5CF6", "#C084FC", "#8B5CF6"]} animationSpeed={5} showBorder={false}>Services</GradientText>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Six interconnected program streams that together address the root causes of social inequality — not just its symptoms.
          </motion.p>
        </div>
      </section>

      {/* Services detail */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {SERVICES.map((s, i) => {
            const Icon = ICON_MAP[s.icon];
            const extras = EXTRA_INFO[s.title] ?? [];
            const reversed = i % 2 !== 0;
            return (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} key={s.slug}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center`}>
                <div className={reversed ? "md:order-2" : ""}>
                  <div className={`inline-flex w-16 h-16 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] items-center justify-center mb-6`}>
                    <Icon size={28} className="text-primary" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight">
                    {s.title}
                  </h2>
                  <p className="text-zinc-400 leading-relaxed mb-8 font-light text-lg">
                    {s.details}
                  </p>
                  <ul className="space-y-4 mb-8">
                    {extras.map(e => (
                      <li key={e} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                        <CheckCircle size={18} className="text-accent shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all">
                    Get Involved <ArrowRight size={16} />
                  </Link>
                </div>
                <div className={`relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl group ${reversed ? "md:order-1" : ""}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
                  <div className={`h-80 lg:h-96 flex items-center justify-center relative z-0`}>
                     {/* Using a placeholder tech-style background gradient instead of solid color for premium feel */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
                    <Icon size={120} className={`text-white/5 group-hover:scale-110 group-hover:text-white/10 transition-all duration-700`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/10 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[400px] bg-gradient-to-r from-primary via-accent to-primary blur-[150px] opacity-20 rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Want to Collaborate or Volunteer?
          </h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto text-lg font-light">
            Whether you're an individual wanting to contribute time or a corporate looking for CSR partnerships, we'd love to connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"
              className="px-10 py-4 bg-white text-black font-bold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all text-sm">
              Contact Us
            </Link>
            <Link to="/events"
              className="px-10 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all text-sm">
              See Upcoming Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
