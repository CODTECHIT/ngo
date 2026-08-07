import { useState, useRef, useEffect } from "react";
import { Heart, Target, Eye, Award, CheckCircle, Shield, HeartHandshake, Sprout, BookOpen, Users, Globe, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion, useInView, animate } from "motion/react";
import { SectionLabel } from "../components/Layout";
import Aurora from "../components/reactbits/Aurora";
import BlurText from "../components/reactbits/BlurText";
import GradientText from "../components/reactbits/GradientText";
import { PartnersMarquee } from "../components/PartnersMarquee";
import { STATS } from "../data";

// ── Animated Counter (counts up when scrolled into view) ──────────────────────
function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const target = parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
  const suffix = value.replace(/[\d,]/g, "");
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString("en-US")),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

// ── Shared Animation Variants ──────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// ── Content ────────────────────────────────────────────────────────────────────
const VALUES = [
  { icon: Shield, title: "Integrity & Transparency", text: "We operate with complete openness—every rupee, every camp, and every partnership is accountable to the communities we serve." },
  { icon: Heart, title: "Compassion & Dignity", text: "We meet every person with respect. Our work is rooted in empathy, ensuring help reaches those who need it most" },
  { icon: HeartHandshake, title: "Collaboration & Partnership", text: "Real change happens together. We work hand-in-hand with healthcare partners, civic bodies, local authorities, and community volunteers." },
  { icon: Sprout, title: "Sustainable Impact", text: "We build programs that outlast a single camp, planting seeds of education, health, and self-reliance for generations." },
];

const FOCUS_AREAS = [
  { icon: Heart, title: "Health & Eye Care", desc: "We make quality, free eye care services and primary healthcare accessible to everyone in society. We actively work to prevent avoidable blindness through regular eye camps, cataract screenings, and the distribution of free eyeglasses.Our ambition is to preserve vision and gift a healthier, brighter future to all.ved communities.", tag: "Health" },
  { icon: BookOpen, title: "Education & Skill Development", desc: "We improve employment opportunities for rural youth through quality education and modern skill training. Our goal is to prepare the next generation for future challenges by fostering personal development and technical knowledge.", tag: "Education" },
  { icon: Users, title: "Women Empowerment", desc: "We lead women toward self-reliance by providing skill development training and employment opportunities. We empower every woman to live with dignity through financial independence, education, and social awareness.", tag: "Women" },
  { icon: Globe, title: "Community & Rural Development", desc: "Believing that national progress is possible through the overall development of rural areas, we strive to build essential infrastructure. We enhance the living standards of rural people by creating employment opportunities, conducting awareness programs, and providing skill development training. Our main objective is to empower every individual in society with self-reliance, a better future, and dignity.", tag: "Community" },
];

const MILESTONES = [
  { year: "Dec 2025", title: "First Health Camp", text: "Our free eye check-up camp in Dahegam screened 150+ people and identified 45 individuals for free spectacles   the spark of our journey." },
  { year: "Jan 2026", title: "Formal Registration", text: "SRISHREE VISION FOUNDATION was registered (No. 20967/6) as a non-profit to scale up our community health and welfare work." },
  { year: "Jun 2026", title: "Blood Donation & Health Check Camp", text: "Partnering with Hindu Jagarana Mancha and iCare Vision Center, we hosted free sugar, BP and hemoglobin testing alongside a blood donation drive." },
  { year: "Jun 2026", title: "Drug Awareness Program", text: "A youth awareness drive in Khagaznagar, run in partnership with Telangana Police, TGNAB and Lions Club of International." },
  { year: "Aug 2026", title: "Annual Green Earth Drive", text: "Our largest planned community event   500+ volunteers joining a massive tree plantation drive at Central Park, Khagaznagar." },
];

export default function About() {
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
            <SectionLabel>Our Story</SectionLabel>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight leading-tight flex items-center justify-center gap-4 flex-wrap">
            <BlurText text="About" delay={150} animateBy="words" direction="top" />
            <GradientText colors={["#0F6E6E", "#4CAF50", "#0F6E6E"]} animationSpeed={5} showBorder={false}>SRISHREE VISION FOUNDATION</GradientText>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-600 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            We are a dedicated non-profit organization transforming communities through accessible eye care, sustainable development, and rural empowerment
          </motion.p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-8 md:py-14 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex justify-center"><SectionLabel className="justify-center">Who We Are</SectionLabel></div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6 whitespace-nowrap">
              A Local Vision with Global Impact
            </h2>            <p className="text-zinc-600 text-lg font-light leading-relaxed">
              Born in the heart of Telangana, India, SRISHREE VISION FOUNDATION exists to close the gap between communities in need and the services that can transform their lives.
            </p>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div variants={fadeIn} className="bg-white border border-black/10 rounded-3xl p-8 md:p-10 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <Sparkles size={20} className="text-primary" />
                <h3 className="text-xl font-bold text-zinc-900">Why We Exist</h3>
              </div>
              <p className="text-zinc-600 font-light leading-relaxed">
                Good vision and basic healthcare shouldn't be a privilege. Across our communities, families miss out on essential screenings and youth lack direction simply due to a lack of access. We chose to step in and bridge this gap one eye camp, one conversation, and one life at a time.              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="bg-white border border-black/10 rounded-3xl p-8 md:p-10 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <Heart size={20} className="text-primary" />
                <h3 className="text-xl font-bold text-zinc-900">How We Work</h3>
              </div>
              <p className="text-zinc-600 font-light leading-relaxed">
                We collaborate with key partners to maximize our impact. Hospitals and vision centers provide quality care, local civic bodies broaden our reach, and dedicated volunteers drive the mission forward. Together, we create meaningful and lasting change.              </p>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Based In", value: "Hyderabad, Telangana" },
              { label: "Registered", value: "No. 20967/6, Jan 2026" },
              { label: "Focus", value: "Health, Education, Women, Community, Environment" },
              { label: "Approach", value: "Camps, Awareness, Outreach" },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-black/[0.03] border border-black/10 rounded-2xl p-5 text-center hover:border-primary/30 transition-all"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">{f.label}</p>
                <p className="text-sm font-semibold text-zinc-800">{f.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 md:py-24 px-4 md:px-6 bg-background border-y border-black/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-multiply pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex justify-center"><SectionLabel className="justify-center">Core Values</SectionLabel></div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6">The Principles That Guide Every Camp</h2>
            <p className="text-zinc-600 text-lg font-light leading-relaxed">
              "Our values are not posters on a wall—they are the standards we hold ourselves to in every program we run."
            </p>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeIn}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-black/10 rounded-3xl p-8 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(15,110,110,0.08)] transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center mb-6 border border-black/10 group-hover:bg-primary group-hover:border-primary transition-colors">
                  <v.icon size={26} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">{v.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed font-light">{v.text}</p>
              </motion.div>
            ))}
          </motion.div>
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
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Director, SRISHREE VISION FOUNDATION</p>
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
              "Restoring Vision, Empowering Futures."
            </motion.h2>
            <motion.div variants={fadeIn} className="space-y-6 text-zinc-600 font-light text-lg leading-relaxed">
              <p>
                At <b>SRISHREE VISION FOUNDATION</b>, we believe that good health and opportunity are fundamental rights, not privileges. Our mission is to restore dignity and transform lives by providing accessible healthcare, quality education, and sustainable skill-building programs.
              </p>
              <p>
                Together with our dedicated volunteers, partners, and community leaders, we are constantly working to create a world where no one is left behind due to preventable challenges.
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="mt-10 flex justify-end"
            >
              <div className="text-right border-t border-zinc-300 pt-3 w-fit">
                <p className="font-bold text-zinc-900 text-xl">
                  Lion Dr. R. Srinivas
                </p>
                <p className="text-primary font-semibold text-sm uppercase tracking-wider mt-1">
                  Founder & Director
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 md:py-24 px-4 md:px-6 bg-background border-y border-black/5 relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {[
            {
              icon: Target,
              title: "Our Mission",
              text: "To transform underserved communities by providing accessible eye care & healthcare, foundational education, and sustainable skill development.",
            },
            {
              icon: Eye,
              title: "Our Vision",
              text: "An inclusive society where clear vision, health, and opportunity empower every individual to thrive, dignified and self-reliant.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white rounded-3xl border border-zinc-200 p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center flex-shrink-0">
                  <item.icon size={30} className="text-primary" />
                </div>

                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">
                  {item.title}
                </h3>
              </div>

              {/* Quote Box */}
              <div className="relative">
                {/* Opening Quote */}
                <span className="absolute -top-7 left-4 text-7xl font-serif text-cyan-300 leading-none select-none">
                  “
                </span>

                <div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-8 shadow-inner">
                  <p className="text-lg leading-9 text-zinc-700">
                    {item.text}
                  </p>
                </div>

                {/* Closing Quote */}
                <span className="absolute -bottom-10 right-5 text-7xl font-serif text-cyan-300 leading-none select-none">
                  ”
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What We Do */}
      <section className="py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <SectionLabel>What We Do</SectionLabel>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">Our Focus Areas</h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors group">
              Explore all programs <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FOCUS_AREAS.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeIn}
                transition={{ delay: i * 0.05 }}
                className="group bg-white border border-black/10 rounded-3xl p-8 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(15,110,110,0.08)] transition-all flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-black/5 flex items-center justify-center border border-black/10 group-hover:bg-primary group-hover:border-primary transition-colors">
                    <f.icon size={26} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">{f.tag}</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3 min-h-[3.5rem]">{f.title}</h3>
                <p className="text-zinc-700 text-base leading-relaxed flex-1 text-left md:text-justify">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-12 md:py-24 px-4 md:px-6 bg-background border-y border-black/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-multiply pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex justify-center"><SectionLabel className="justify-center">Our Journey</SectionLabel></div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6">From One Camp to a Movement</h2>
            <p className="text-zinc-600 text-lg font-light leading-relaxed">
              Every milestone reflects the dedication of our volunteers, the strength of our partners, and the trust of the communities we serve.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/40 to-transparent" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-12"
                >
                  <span className="absolute left-4 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/15" />
                  <div className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-all">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">{m.year}</span>
                    <h3 className="text-xl font-bold text-zinc-900 mt-2">{m.title}</h3>
                    <p className="text-zinc-600 font-light mt-2 leading-relaxed">{m.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact at a Glance */}
      <section className="py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex justify-center mb-5">
              <SectionLabel className="justify-center text-2xl md:text-3xl">
                Impact at a Glance
              </SectionLabel>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
              Driven by Purpose,
              <br />
              Measured by Impact
            </h2>

            <p className="text-zinc-800 text-xl font-normal leading-relaxed max-w-3xl mx-auto">
              A snapshot of how our grassroots programs are transforming lives and
              empowering communities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-black/10 rounded-3xl p-8 text-center hover:border-primary/30 hover:shadow-[0_0_30px_rgba(15,110,110,0.08)] transition-all"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-3 tracking-tight">
                  <AnimatedCounter value={s.value} />
                </p>

                <p className="text-zinc-700 text-sm font-medium leading-relaxed">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Directors Section */}
      <section id="leadership" className="py-12 md:py-24 px-4 md:px-6 bg-slate-50 dark:bg-slate-900/50 border-y border-black/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex justify-center"><SectionLabel className="justify-center">Board of Directors</SectionLabel></div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">Our Leadership & Directors</h2>
            <p className="text-zinc-600 dark:text-slate-300 text-lg font-light leading-relaxed">
              Guided by dedicated clinical advisors and community leaders committed to ending preventable blindness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Director 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 border border-black/10 dark:border-slate-700 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col"
            >
              <div className="w-full bg-zinc-50 dark:bg-slate-900 border-b border-black/5 dark:border-white/5 h-[320px] relative overflow-hidden">
                <img
                  src="/director.jpeg"
                  alt="Lion Dr. R. Srinivas"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-8 text-center flex flex-col items-center flex-1">
                <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-full uppercase tracking-wider mb-4">
                  Lions Clubs International Member
                </span>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">Lion Dr. R. Srinivas</h3>
                <p className="text-primary font-bold text-sm mb-4">Director & Founder</p>
                <p className="text-zinc-600 dark:text-slate-400 text-sm leading-relaxed">
                  An experienced leader driving health screening, eye care outreach, and youth drug awareness campaigns nationwide.
                </p>
              </div>
            </motion.div>

            {/* Director 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-800 border border-black/10 dark:border-slate-700 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col"
            >
              <div className="w-full bg-zinc-50 dark:bg-slate-900 border-b border-black/5 dark:border-white/5 h-[320px] relative overflow-hidden">
                <img
                  src="/director 2.jpeg"
                  alt="Lion J. Indhyarani"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-8 text-center flex flex-col items-center flex-1">
                <span className="inline-block px-3 py-1 bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 text-[10px] font-bold rounded-full uppercase tracking-wider mb-4">
                  Lions Clubs International Member
                </span>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">Lion J. Indhyarani</h3>
                <p className="text-primary font-bold text-sm mb-4">Director</p>
                <p>Director leading community empowerment, rural health programs, and social welfare drives.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 md:py-24 px-4 md:px-6 bg-background border-y border-black/5 relative overflow-hidden">

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-multiply pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex justify-center"><SectionLabel className="justify-center">Partners With</SectionLabel></div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6">Stronger Together</h2>
            <p className="text-zinc-600 text-lg font-light leading-relaxed">
              Our programs are powered by trusted partners who share their expertise, reach and resources.
            </p>
          </div>

          <PartnersMarquee />
        </div>
      </section>

      {/* Registration & Compliance */}
      <section className="py-12 md:py-32 px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionLabel className="justify-center">Compliance</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-8 tracking-tight">Registration & Compliance</h2>
          <p className="text-zinc-600 text-lg leading-relaxed font-light mb-12">
            SRISHREE VISION FOUNDATION is formally registered and compliant with all statutory regulations to ensure complete transparency in our operations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {[
              "Registration No: 20967/6, Dated 14/01/2026",
              "CIN No: U85500TS2026NPL209676",
              "PAN: ABSCS4201R",
              "TAN: HYDS90801E",
              "Registered Address: 1-11-22,   Golnaka Alwal, Tirumaligiri, Hyderabad, Telangana - 500010"
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

      {/* Get Involved CTA */}
      <section className="pb-24 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center bg-gradient-to-br from-primary to-accent rounded-[2rem] py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Be Part of the Change</h2>
            <p className="text-white/85 text-lg font-light mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you volunteer your time, share your expertise, or make a donation, every contribution takes us one step closer to a thriving, self-reliant community
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/apply?category=volunteer" className="px-8 py-4 bg-white text-primary font-bold rounded-full hover:scale-105 transition-all shadow-lg block text-center">
                Volunteer With Us
              </Link>
              <Link to="/donate" className="px-8 py-4 border-2 border-white/70 text-white font-bold rounded-full hover:bg-white/10 hover:scale-105 transition-all block text-center">
                Support Our Mission
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
