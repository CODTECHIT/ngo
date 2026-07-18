import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useState } from "react";
import { motion } from "motion/react";
import { SectionLabel } from "../components/Layout";

// ── Shared Animation Variants ──────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fname = formData.get('fname') as string;
    const lname = formData.get('lname') as string;
    const email = formData.get('email') as string;
    const phone = (formData.get('phone') as string) || '';
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    
    const form = e.currentTarget;
    try {
      const { error } = await supabase.from('messages').insert([
        {
          fname,
          lname,
          email,
          subject,
          message: phone ? `[Phone: ${phone}]\n\n${message}` : message
        }
      ]);
      
      if (error) throw error;
      
      setSubmitted(true);
      form.reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Failed to send message', err);
      alert('Failed to send message.');
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden flex items-center justify-center md:min-h-[60vh]">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none">
          <div className="absolute top-[10%] right-[20%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_alternate]" />
        </div>
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-multiply z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center">
            <SectionLabel>Reach Out</SectionLabel>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight leading-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-600 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Whether you want to volunteer, partner with us, or learn more about our impact, we would love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Details */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 mb-6 tracking-tight">Contact Information</h2>
              <p className="text-zinc-600 font-light leading-relaxed mb-8">
                Our team is available Monday through Saturday. For urgent press or media inquiries, please email the director directly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: MapPin, title: "Head Office", lines: ["1-11-22, Shop No. 3, Golnaka Alwal,", "Tirumalagiri, Hyderabad, Telangana - 500010"] },
                { icon: Phone, title: "Phone", lines: ["+91 98765 43210"] },
                { icon: Mail, title: "Email", lines: ["contact@srishreevision.org"] },
                { icon: Clock, title: "Working Hours", lines: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"] }
              ].map((item, i) => (
                <motion.div variants={fadeIn} key={item.title} className="bg-black/5 border border-black/5 rounded-2xl p-6 hover:border-black/20 hover:bg-black/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center mb-4">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-zinc-900 mb-2">{item.title}</h3>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-sm text-zinc-600 font-light">{line}</p>
                  ))}
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeIn} className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="font-bold text-zinc-900 mb-2">Corporate Partnerships</h3>
              <p className="text-sm text-zinc-700 font-light mb-4">
                Looking to fulfill your CSR mandate? Download our corporate partnership brochure.
              </p>
              <button className="text-sm font-bold text-primary hover:text-zinc-900 transition-colors underline decoration-primary/50 underline-offset-4">
                Download Brochure PDF
              </button>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white border border-black/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            
            <h2 className="text-3xl font-bold text-zinc-900 mb-8 tracking-tight">Send a Message</h2>
            
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 md:py-20 px-4 md:px-6 text-center h-full">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Message Sent!</h3>
                <p className="text-zinc-600 font-light">Thank you for reaching out. Our team will get back to you within 24-48 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">First Name</label>
                    <input required name="fname" type="text" className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Last Name</label>
                    <input required name="lname" type="text" className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Email Address</label>
                    <input required name="email" type="email" className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Phone Number (Optional)</label>
                    <input name="phone" type="tel" className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors" placeholder="+91 90000 00000" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Subject</label>
                  <select required name="subject" className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors appearance-none">
                    <option value="" disabled className="bg-white text-zinc-500">Select a topic</option>
                    <option value="volunteer" className="bg-white text-zinc-900">I want to Volunteer</option>
                    <option value="donate" className="bg-white text-zinc-900">Donation Inquiry</option>
                    <option value="partner" className="bg-white text-zinc-900">Corporate Partnership (CSR)</option>
                    <option value="other" className="bg-white text-zinc-900">Other Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Message</label>
                  <textarea required name="message" rows={5} className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors resize-none" placeholder="How can we help you?" />
                </div>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(15,110,110,0.3)] hover:shadow-[0_0_30px_rgba(41,182,246,0.5)] flex items-center justify-center gap-2">
                  Send Message <Send size={16} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-full h-96 bg-black/5 border border-black/10 rounded-3xl overflow-hidden relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&h=800&fit=crop&auto=format')] opacity-20 object-cover mix-blend-luminosity grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(15,110,110,0.3)] animate-bounce">
                <MapPin size={24} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">Visit Our HQ</h3>
              <p className="text-zinc-600 font-light mt-2 line-clamp-1">{"Hyderabad, Telangana"}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
