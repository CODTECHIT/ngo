import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { CheckCircle2, Send, Users, Building2, GraduationCap, HandCoins, Handshake, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../../lib/supabase";
import { SectionLabel } from "../components/Layout";

const CATEGORY_OPTIONS = [
  { value: "volunteer", label: "Volunteer", icon: Users, blurb: "Give your time and skills to change lives." },
  { value: "csr", label: "Corporate CSR", icon: Building2, blurb: "Partner your company's CSR with our mission." },
  { value: "intern", label: "Intern With Us", icon: GraduationCap, blurb: "Gain hands-on experience with our team." },
  { value: "fundraise", label: "Fundraise", icon: HandCoins, blurb: "Raise funds for the causes we serve." },
  { value: "partner", label: "Partner NGOs", icon: Handshake, blurb: "Collaborate with us as a fellow organization." },
];

const SERVICE_OPTIONS: Record<string, string[]> = {
  volunteer: [
    "Health & Eye Care Camps",
    "Education & Skill Development",
    "Women Empowerment",
    "Community & Rural Development",
    "Public Health Awareness",
    "Event Support",
    "Fundraising Support",
  ],
  csr: [
    "Healthcare Initiatives",
    "Education Programs",
    "Women Empowerment",
    "Community Development",
    "Employee Volunteering",
    "Event Sponsorship",
  ],
  intern: [
    "Social Media & Marketing",
    "Event Management",
    "Fundraising & Grants",
    "Research & Documentation",
    "Field Outreach",
    "Content Writing",
  ],
  fundraise: [
    "Crowdfunding Campaign",
    "Corporate Sponsorship",
    "Organize a Fundraising Event",
    "Monthly Giving Program",
    "Birthday / Occasion Giving",
  ],
  partner: [
    "NGO Collaboration",
    "Healthcare Partnership",
    "Educational Partnership",
    "Corporate Partnership",
    "Government Liaison",
    "Community Network",
  ],
};

const MANUAL_SERVICE = "__other__";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function Apply() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "volunteer";

  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState(
    CATEGORY_OPTIONS.some(c => c.value === initialCategory) ? initialCategory : "volunteer"
  );
  const [service, setService] = useState("");
  const [manualService, setManualService] = useState("");

  const categoryMeta = useMemo(
    () => CATEGORY_OPTIONS.find(c => c.value === category) || CATEGORY_OPTIONS[0],
    [category]
  );

  const services = SERVICE_OPTIONS[category] || SERVICE_OPTIONS.volunteer;
  const showManualInput = service === MANUAL_SERVICE;
  const finalService = showManualInput ? manualService.trim() : service;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = (formData.get("full_name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const phone = (formData.get("phone") as string) || "";
    const city = (formData.get("city") as string) || "";
    const message = (formData.get("message") as string) || "";

    if (!finalService) {
      alert("Please select the service you would like to do, or type it manually.");
      return;
    }

    const form = e.currentTarget;
    try {
      // 1. Save to Supabase applications table for the Admin Panel
      let savedToDb = false;
      try {
        const { error } = await supabase.from("applications").insert([
          {
            full_name: fullName,
            email,
            phone,
            city,
            category,
            service: finalService,
            message,
            status: "pending",
            is_read: false,
          }
        ]);
        if (error) throw error;
        savedToDb = true;
      } catch (dbErr) {
        console.warn("Supabase applications insert error:", dbErr);
      }

      // 1b. Fallback: if the applications table isn't ready, save into the
      // messages table so the application still reaches the Admin Panel.
      if (!savedToDb) {
        try {
          const { error: msgErr } = await supabase.from("messages").insert([
            {
              fname: fullName,
              lname: "",
              email,
              subject: `[App] ${category}`,
              message:
                `Category: ${category}\n` +
                `Service: ${finalService}\n` +
                `Phone: ${phone || "N/A"}\n` +
                `City: ${city || "N/A"}\n` +
                `\n${message}`
            }
          ]);
          if (msgErr) console.warn("Supabase messages fallback insert error:", msgErr);
        } catch (e) {
          console.warn("Supabase messages fallback failed:", e);
        }
      }

      // 2. Save to LocalStorage backup so the Admin Panel shows it even if offline/DB fails
      try {
        const LOCAL_KEY = "ngo_saved_applications";
        const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
        existing.unshift({
          id: "local_app_" + Date.now(),
          full_name: fullName,
          email,
          phone,
          city,
          category,
          service: finalService,
          message,
          status: "pending",
          is_read: false,
          created_at: new Date().toISOString()
        });
        localStorage.setItem(LOCAL_KEY, JSON.stringify(existing));
      } catch (e) {}

      // 3. Open WhatsApp with a prefilled message so the admin gets an instant notification
      const whatsappText = encodeURIComponent(
        `*New ${categoryMeta.label} Application - Srishreevision Foundation*\n\n` +
        `👤 *Name:* ${fullName}\n` +
        `✉️ *Email:* ${email}\n` +
        `📞 *Phone:* ${phone || "N/A"}\n` +
        `📍 *City:* ${city || "N/A"}\n` +
        `📌 *Category:* ${categoryMeta.label}\n` +
        `🛠 *Service:* ${finalService}\n\n` +
        `💬 *Message:*\n${message || "—"}`
      );
      window.open(`https://wa.me/918977910974?text=${whatsappText}`, "_blank");

      setSubmitted(true);
      form.reset();
      setService("");
      setManualService("");
    } catch (err) {
      console.error("Failed to submit application", err);
      alert("Failed to submit your application. Please try again.");
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors";

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-10 md:pt-28 md:pb-14 relative overflow-hidden flex items-center justify-center md:min-h-[45vh]">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none">
          <div className="absolute top-[10%] right-[20%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_alternate]" />
        </div>

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-multiply z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center">
            <SectionLabel>Get Involved</SectionLabel>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight leading-tight">
            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Our Mission</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-600 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Tell us a little about yourself and the service you want to contribute. Our team will reach out to you shortly.
          </motion.p>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-8 md:py-14 px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="bg-white border border-black/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 md:py-20 px-4 md:px-6 text-center h-full">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Application Submitted!</h3>
                <p className="text-zinc-600 font-light">
                  Thank you for your interest. Our team has received your application and will get back to you within 24-48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Category selector */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block">I want to</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CATEGORY_OPTIONS.map(opt => {
                      const Icon = opt.icon;
                      const active = category === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setCategory(opt.value); setService(""); setManualService(""); }}
                          className={`p-4 rounded-2xl border text-left transition-all ${active
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                            : "bg-black/5 border-black/10 hover:border-primary/40 hover:bg-black/[0.04]"
                          }`}
                        >
                          <Icon size={18} className={`mb-2 ${active ? "text-white" : "text-primary"}`} />
                          <div className={`font-bold text-sm ${active ? "text-white" : "text-zinc-900"}`}>{opt.label}</div>
                          <div className={`text-[11px] leading-snug mt-1 ${active ? "text-white/80" : "text-zinc-500"}`}>{opt.blurb}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Full Name</label>
                    <input required name="full_name" type="text" className={inputCls} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Email Address</label>
                    <input required name="email" type="email" className={inputCls} placeholder="you@example.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Phone Number (Optional)</label>
                    <input name="phone" type="tel" className={inputCls} placeholder="+91 90000 00000" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">City (Optional)</label>
                    <input name="city" type="text" className={inputCls} placeholder="Your city" />
                  </div>
                </div>

                {/* Service selection */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">
                    Service / Area you want to do ({categoryMeta.label})
                  </label>
                  <div className="relative">
                    <select
                      required={!showManualInput}
                      value={service}
                      onChange={e => setService(e.target.value)}
                      className={`${inputCls} appearance-none pr-10`}
                    >
                      <option value="" disabled className="bg-white text-zinc-500">Select a service</option>
                      {services.map(s => (
                        <option key={s} value={s} className="bg-white text-zinc-900">{s}</option>
                      ))}
                      <option value={MANUAL_SERVICE} className="bg-white text-zinc-900">Other — type it manually</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>

                  {showManualInput && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3"
                    >
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Describe the service</label>
                      <input
                        required
                        type="text"
                        value={manualService}
                        onChange={e => setManualService(e.target.value)}
                        className={inputCls}
                        placeholder="e.g. Teach computer basics to students"
                      />
                    </motion.div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Message (Optional)</label>
                  <textarea name="message" rows={4} className={`${inputCls} resize-none`} placeholder="Tell us about your experience, availability, or anything else we should know." />
                </div>

                <button type="submit" className="w-full py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(15,110,110,0.3)] hover:shadow-[0_0_30px_rgba(41,182,246,0.5)] flex items-center justify-center gap-2">
                  Submit Application <Send size={16} />
                </button>
                <p className="text-[11px] text-zinc-400 text-center font-light">
                  Your application goes directly to our admin team. We typically respond within 24-48 hours.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
