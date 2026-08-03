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
      // 1. Save to Supabase messages table for Admin Panel
      try {
        await supabase.from('messages').insert([
          {
            fname,
            lname,
            email,
            subject,
            message: phone ? `[Phone: ${phone}]\n\n${message}` : message
          }
        ]);
      } catch (dbErr) {
        console.warn("Supabase insert error:", dbErr);
      }

      // 2. Save to LocalStorage backup so Admin Panel shows message even if offline/DB fail
      try {
        const LOCAL_KEY = 'ngo_saved_messages';
        const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
        existing.unshift({
          id: 'local_msg_' + Date.now(),
          fname,
          lname,
          email,
          phone,
          subject,
          message,
          created_at: new Date().toISOString()
        });
        localStorage.setItem(LOCAL_KEY, JSON.stringify(existing));
      } catch (e) {}

      // 3. Open WhatsApp with prefilled message text for instant WhatsApp notification to Admin
      const whatsappText = encodeURIComponent(
        `*New Contact Message - Srishreevision Foundation*\n\n` +
        `👤 *Name:* ${fname} ${lname}\n` +
        `✉️ *Email:* ${email}\n` +
        `📞 *Phone:* ${phone || 'N/A'}\n` +
        `📌 *Subject:* ${subject}\n\n` +
        `💬 *Message:*\n${message}`
      );
      const whatsappUrl = `https://wa.me/918977910974?text=${whatsappText}`;
      window.open(whatsappUrl, '_blank');

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
      <section className="pt-24 pb-10 md:pt-28 md:pb-14 relative overflow-hidden flex items-center justify-center md:min-h-[45vh]">
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
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight leading-tight">
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
      <section className="py-8 md:py-14 px-4 md:px-6 relative z-10">
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
                { icon: MapPin, title: "Head Office", lines: ["1-11-22,   Golnaka Alwal,", "Tirumalagiri, Hyderabad, Telangana - 500010"] },
                {
                  icon: Phone, title: "Phone", lines: ["+918977910974", "+919701100974"]
                },
                { icon: Mail, title: "Email", lines: ["srishreevisionfoundation1@gmail.com"] },
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

      {/* Map Locations */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(15,110,110,0.3)] animate-bounce">
              <MapPin size={22} />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">Visit Our Locations</h3>
            <p className="text-zinc-600 font-light mt-2 text-sm">Find us at any of our branches across Hyderabad</p>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "ICARE & WEAR Optical Eyec Clinic, Alwal",
                address: "Alwal, Hyderabad, Telangana",
                src: "https://www.google.com/maps?q=17.5029057,78.5119689&hl=en&z=16&output=embed",
                link: "https://www.google.com/maps/place/ICARE%26WEAR+OPTICAL+EYECLINIC+,ALWAL/@17.5029057,78.5119689,942m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bcb9adcf9b29615:0x840bc91729fcb7a5!8m2!3d17.5029057!4d78.5119689!16s%2Fg%2F11bt_h1c78?entry=ttu"
              },
              {
                title: "i GEAR Optical",
                address: "Alwal, Hyderabad, Telangana",
                src: "https://www.google.com/maps?q=17.5052784,78.5069741&hl=en&z=16&output=embed",
                link: "https://www.google.com/maps/place/i+GEAR+OPTICALS/@17.5052784,78.5069741,942m/data/!3m6!1m3!4b1!4m6!3m5!1s0x3bcb9bc8078ef09b:0x156473b3803705af!8m2!3d17.5052784!4d78.5069741!16s%2Fg%2F11vq8_g750?entry=ttu"
              },
              {
                title: "Suchitra X Road",
                address: "Plot No 47, Suchitra X Rd, opposite Meeseva Center, Suchitra, Green Park, Jeedimetla, Hyderabad, Telangana 500067",
                src: "https://www.google.com/maps?q=Plot%20No%2047%2C%20Suchitra%20X%20Rd%2C%20opposite%20Meeseva%20Center%2C%20Suchitra%2C%20Green%20Park%2C%20Jeedimetla%2C%20Hyderabad%2C%20Telangana%20500067&hl=en&z=16&output=embed",
                link: "https://www.google.com/maps/search/?api=1&query=Plot%20No%2047%2C%20Suchitra%20X%20Rd%2C%20Suchitra%2C%20Green%20Park%2C%20Jeedimetla%2C%20Hyderabad%2C%20Telangana%20500067"
              }
            ].map((loc, i) => (
              <motion.div
                key={loc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border border-black/10 rounded-3xl p-4 md:p-5 shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3 gap-4 flex-wrap">
                  <div>
                    <h4 className="text-lg font-bold text-zinc-900 tracking-tight">{loc.title}</h4>
                    <p className="text-xs text-zinc-600 font-light mt-0.5 ml-1">{loc.address}</p>
                  </div>
                  <a
                    href={loc.link}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(15,110,110,0.25)]"
                  >
                    <MapPin size={14} /> Open in Maps
                  </a>
                </div>
                <div className="w-full h-44 md:h-52 rounded-2xl overflow-hidden border border-black/10">
                  <iframe
                    title={loc.title}
                    src={loc.src}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
