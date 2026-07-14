import { Heart, Target, Eye, Award, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { SectionLabel } from "../components/Layout";
import Aurora from "../components/reactbits/Aurora";
import BlurText from "../components/reactbits/BlurText";
import GradientText from "../components/reactbits/GradientText";

// ── Shared Animation Variants ──────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function About() {
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
            <SectionLabel>Our Story</SectionLabel>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight flex items-center justify-center gap-4 flex-wrap">
            <BlurText text="About" delay={150} animateBy="words" direction="top" />
            <GradientText colors={["#8B5CF6", "#C084FC", "#8B5CF6"]} animationSpeed={5} showBorder={false}>LEAD TO SERVE</GradientText>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Founded in 2009, we are a grassroots NGO dedicated to holistic community development, operating across nine states in India.
          </motion.p>
        </div>
      </section>

      {/* Founder's Message */}
      <section className="py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform -rotate-3 scale-105 -z-10" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop&auto=format"
                alt="Dr. Kamla Mishra"
                className="w-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Dr. Kamla Mishra</h3>
                  <p className="text-accent text-xs font-bold uppercase tracking-widest">Founder & Director</p>
                </div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                  <Award size={24} className="text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeIn}><SectionLabel>Message from the Director</SectionLabel></motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white tracking-tight">
              "Change does not roll in on the wheels of inevitability, but comes through continuous struggle."
            </motion.h2>
            <motion.div variants={fadeIn} className="space-y-6 text-zinc-400 font-light text-lg leading-relaxed">
              <p>
                When we started LEAD TO SERVE sixteen years ago, our goal was simple: to ensure no child in our east Delhi neighborhood went to sleep hungry. What started as a small community kitchen soon revealed deeper systemic issues — lack of education, missing healthcare, and environmental degradation.
              </p>
              <p>
                Today, our focus has shifted from mere charity to systemic empowerment. We believe that marginalized communities do not just need aid; they need the tools, skills, and platforms to rewrite their own destinies. 
              </p>
              <p>
                Our vision is an India where opportunity is not a privilege of birth, but a fundamental right. And with your support, we are building that reality, one life at a time.
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="mt-10">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" alt="Signature" className="h-12 opacity-50 invert" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 md:py-24 px-4 md:px-6 bg-zinc-950 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {[
            { icon: Target, title: "Our Mission", text: "To enable marginalized communities to lead lives of dignity, economic independence, and ecological harmony through grassroots capacity building and advocacy." },
            { icon: Eye, title: "Our Vision", text: "An equitable India where every citizen has equal access to opportunity, quality healthcare, and a clean, sustainable environment." },
          ].map((item, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} key={item.title} className="bg-zinc-900 border border-white/10 rounded-3xl p-10 hover:border-white/20 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                <item.icon size={32} className="text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{item.title}</h3>
              <p className="text-zinc-400 text-lg leading-relaxed font-light">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Transparency & Governance */}
      <section className="py-16 md:py-32 px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionLabel className="justify-center">Accountability</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Transparency & Governance</h2>
          <p className="text-zinc-400 text-lg leading-relaxed font-light mb-12">
            LEAD TO SERVE is registered as a non-profit organization under the Societies Registration Act, 1860. We maintain strict internal controls, annual external audits, and complete transparency with our donors.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              "80G Tax Exemption Certified",
              "FCRA Approved for Foreign Funds",
              "ISO 9001:2015 Certified",
              "Annual Reports Publicly Available",
              "Quarterly Impact Assessments",
              "Independent Board of Directors"
            ].map((text, i) => (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <CheckCircle size={18} className="text-accent shrink-0" />
                <span className="text-sm text-zinc-300 font-medium">{text}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16">
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Request Financial Audit Report
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
