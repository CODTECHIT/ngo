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
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-6 relative overflow-hidden flex flex-col items-center justify-center md:min-h-[70vh]">
        {/* React Bits Aurora Background */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-multiply">
          <Aurora colorStops={["#0F6E6E", "#29B6F6", "#4CAF50"]} amplitude={1.2} />
        </div>
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-multiply z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center">
            <SectionLabel>Our Story</SectionLabel>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight leading-tight flex items-center justify-center gap-4 flex-wrap">
            <BlurText text="About" delay={150} animateBy="words" direction="top" />
            <GradientText colors={["#0F6E6E", "#4CAF50", "#0F6E6E"]} animationSpeed={5} showBorder={false}>SRISHREEVISION FOUNDATION</GradientText>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-600 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            We are a registered non-profit organization dedicated to empowering communities and fostering sustainable development.
          </motion.p>
        </div>
      </section>

      {/* Founder's Message */}
      <section className="py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform -rotate-3 scale-105 -z-10" />
            <div className="relative rounded-3xl overflow-hidden border border-black/10 shadow-2xl">
              <img
                src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2mCijkGTMih5BfvK3XUYBjf6mljaaJ-ICXS8tnagV5KsjlbvD-PfASC4&s=10"}
                alt={"Director"}
                className="w-full object-cover transition-all duration-700 bg-black/5 min-h-[400px]"
              />

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{"Director"}</h3>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Director, Srishreevision Foundation</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                  <Award size={24} className="text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeIn}><SectionLabel>Message from the Director</SectionLabel></motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-zinc-900 tracking-tight">
              "Empowering people, changing lives."
            </motion.h2>
            <motion.div variants={fadeIn} className="space-y-6 text-zinc-600 font-light text-lg leading-relaxed">
              <p>
                At Srishreevision Foundation, our work is driven by a profound commitment to human dignity. We believe that empowering individuals with better healthcare, foundational education, and essential skills creates a ripple effect that transforms entire communities.
              </p>
              <p>
                By bringing together passionate volunteers, dedicated partners, and grassroots initiatives, we are steadily working towards a society where every person has the opportunity to thrive and succeed, no matter their background.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 md:py-24 px-4 md:px-6 bg-background border-y border-black/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-multiply pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {[
            { icon: Target, title: "Our Mission", text: "To empower individuals with better healthcare, foundational education, and essential skills." },
            { icon: Eye, title: "Our Vision", text: "A society where every person has the opportunity to thrive and succeed, no matter their background." },
          ].map((item, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} key={item.title} className="bg-white border border-black/10 rounded-3xl p-10 hover:border-black/20 transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.05)]">
              <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mb-8 border border-black/10">
                <item.icon size={32} className="text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">{item.title}</h3>
              <p className="text-zinc-600 text-lg leading-relaxed font-light">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Registration & Compliance */}
      <section className="py-12 md:py-32 px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionLabel className="justify-center">Compliance</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-8 tracking-tight">Registration & Compliance</h2>
          <p className="text-zinc-600 text-lg leading-relaxed font-light mb-12">
            SRISHREEVISION FOUNDATION is formally registered and compliant with all statutory regulations to ensure complete transparency in our operations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {[
              "Registration No: 20967/6, Dated 14/01/2026",
              "CIN No: U85500TS2026NPL209676",
              "PAN: ABSCS4201R",
              "TAN: HYDS90801E",
              "Registered Address: 1-11-22, Shop No. 3, Golnaka Alwal, Tirumalagiri, Hyderabad, Telangana - 500010"
            ].map((text, i) => (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className={`flex items-start gap-3 bg-black/5 border border-black/10 rounded-xl p-4 ${i === 4 ? 'md:col-span-2' : ''}`}>
                <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-700 font-medium">{text}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16">
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(15,110,110,0.2)]">
              Request Financial Audit Report
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
