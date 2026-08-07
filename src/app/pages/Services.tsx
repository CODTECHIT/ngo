import { useState, useEffect } from "react";
import { ArrowRight, BookOpen, Leaf, Users, Globe, Shield, Handshake, CheckCircle, Heart } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { SectionLabel } from "../components/Layout";
import { SERVICES } from "../data";
import { usePrograms } from "../hooks/usePrograms";
import Aurora from "../components/reactbits/Aurora";
import BlurText from "../components/reactbits/BlurText";
import GradientText from "../components/reactbits/GradientText";

const ICON_MAP: Record<string, React.ElementType> = { heart: Heart, book: BookOpen, users: Users, globe: Globe, shield: Shield, handshake: Handshake, BookOpen, Leaf, Users, Globe, Shield, Handshake, Heart };

const EXTRA_INFO: Record<string, string[]> = {
  "Health & Eye Care Camps": ["Comprehensive eye screening", "Free prescription spectacles", "Regular blood donation camps"],
  "Education & Skill Development": ["Youth skill-building workshops", "Agricultural best practices", "Career guidance sessions"],
  "Women Empowerment": ["Confidence-building programs", "Community participation platforms", "Self-Sustainabilitysupport"],
  "Community & Rural Development": ["Anti-drug awareness campaigns", "Polio vaccination drives", "Rural outreach initiatives"],
  "Public Health Awareness": ["Safe pesticide usage training", "Youth drug-free campaigns", "Disease prevention drives"],
  "Partnerships & Community Outreach": ["Joint events with local police", "Medical camps with iCare", "Support from Lions Club"],
};

// ── Shared Animation Variants ──────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

function ServiceCard({ s, index }: { s: any, index: number }) {
  const Icon = ICON_MAP[s.icon] || Heart;
  const extras = s.points || [];
  const reversed = index % 2 !== 0;

  const images = s.img ? s.img.split(',').filter(Boolean) : [];
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
      className={`grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center`}>
      <div className={reversed ? "md:order-2" : ""}>
        <div className={`inline-flex w-16 h-16 rounded-2xl bg-black/5 border border-black/10 shadow-[0_0_15px_rgba(0,0,0,0.05)] items-center justify-center mb-6`}>
          <Icon size={28} className="text-primary" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-6 tracking-tight">
          {s.title}
        </h2>
        <p className="text-zinc-600 leading-relaxed mb-8 font-light text-lg">
          {s.details}
        </p>
        <ul className="space-y-4 mb-8">
          {extras.map((e: string) => (
            <li key={e} className="flex items-center gap-3 text-sm text-zinc-700 font-medium">
              <CheckCircle size={18} className="text-accent shrink-0" />
              {e}
            </li>
          ))}
        </ul>
        <Link to="/apply"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(15,110,110,0.3)] hover:scale-105 transition-all">
          Get Involved <ArrowRight size={16} />
        </Link>
      </div>
      <div className={`relative rounded-3xl overflow-hidden border border-black/10 bg-black/5 shadow-2xl group ${reversed ? "md:order-1" : ""}`}>
        <div className={`h-80 lg:h-96 flex items-center justify-center relative z-0`}>
          {images.map((imgUrl: string, idx: number) => (
            <img
              key={idx}
              src={imgUrl}
              alt={s.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentImg ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {images.map((_, idx: number) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImg ? 'bg-white scale-125' : 'bg-white/50'}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { programs, loading } = usePrograms();

  // Use DB programs if available, otherwise fallback to static data
  const displayServices = programs.length > 0 ? programs.map(p => ({
    slug: p.id,
    icon: p.icon_name.toLowerCase(),
    title: p.title,
    img: p.image_url,
    desc: p.description,
    details: p.description, // programs don't have details column right now
    points: p.points || []
  })) : SERVICES.map(s => ({
    ...s,
    points: EXTRA_INFO[s.title] || []
  }));

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-10 md:pt-28 md:pb-14 px-4 md:px-6 relative overflow-hidden flex flex-col items-center justify-center md:min-h-[45vh]">
        {/* React Bits Aurora Background */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-multiply">
          <Aurora colorStops={["#0F6E6E", "#29B6F6", "#4CAF50"]} amplitude={1.2} />
        </div>

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-multiply z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center">
            <SectionLabel>Programs</SectionLabel>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight leading-tight flex items-center justify-center gap-4 flex-wrap">
            <BlurText text="Our" delay={150} animateBy="words" direction="top" />
            <GradientText colors={["#0F6E6E", "#4CAF50", "#0F6E6E"]} animationSpeed={5} showBorder={false}>Services</GradientText>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-600 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Six interconnected program streams that together address the root causes of social inequality   not just its symptoms.
          </motion.p>
        </div>
      </section>

      {/* Services detail */}
      <section className="py-8 md:py-14 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {displayServices.map((s, i) => (
            <ServiceCard key={`${s.slug}-${i}`} s={s} index={i} />
          ))}
        </div>
      </section>

      {/* FAQ - answer engine optimization (AEO) */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative z-10" id="faq">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-4">
            <SectionLabel>FAQs</SectionLabel>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-10 text-center tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              ["Does the foundation conduct free eye camps?", "Yes. Srishree Vision Foundation runs free eye check-up camps with comprehensive screening and distribution of free spectacles, often in partnership with iCare Vision Center and Lions Club."],
              ["What health programs does the NGO run?", "Free eye camps, blood donation drives, sugar/BP/hemoglobin health screening, polio awareness and public health-prevention campaigns across Telangana."],
              ["Do you run women empowerment programs?", "Yes. We run confidence-building, skill-training and self-reliance programs that help women achieve financial independence and dignity."],
              ["How can my organization partner with Srishree Vision Foundation?", "We collaborate with Lions Clubs, iCare Vision Center, Telangana Police, TGNAB and other bodies. Use the Apply page to propose a partnership."],
            ].map(([q, a]) => (
              <details key={q} className="group bg-white/60 border border-black/10 rounded-2xl overflow-hidden">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-5 py-4 font-bold text-zinc-900 text-sm md:text-base">
                  {q}
                  <span className="text-primary text-xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 text-zinc-600 text-sm md:text-base font-light leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-16 px-4 md:px-6 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/10 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[400px] bg-gradient-to-r from-primary via-accent to-primary blur-[150px] opacity-20 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 tracking-tight">
            Want to Collaborate or Volunteer?
          </h2>
          <p className="text-zinc-600 mb-10 max-w-xl mx-auto text-lg font-light">
            Whether you're an individual wanting to contribute time or a corporate looking for CSR partnerships, we'd love to connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"
              className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-full shadow-[0_0_30px_rgba(15,110,110,0.2)] hover:scale-105 transition-all text-sm">
              Contact Us
            </Link>
            <Link to="/events"
              className="px-10 py-4 border border-black/20 text-zinc-900 font-bold rounded-full hover:bg-black/5 transition-all text-sm">
              See Upcoming Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
