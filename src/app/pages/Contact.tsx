import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, MessageCircle, Clock } from "lucide-react";
import { SectionLabel } from "../components/Layout";

export default function Contact() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-28 bg-foreground relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1400&h=500&fit=crop&auto=format"
          alt="Contact and communication"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <SectionLabel light>Reach Out</SectionLabel>
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Contact Us
          </h1>
          <p className="text-primary-foreground/70 max-w-xl mx-auto text-lg leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            For partnerships, volunteering, media inquiries, or general questions — we respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <SectionLabel>Get in Touch</SectionLabel>
            <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
              We're Here to Help
            </h2>
            <div className="space-y-6 mb-10">
              {[
                { icon: MapPin, label: "Head Office", value: "47-B, Lajpat Nagar II, New Delhi — 110024" },
                { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                { icon: Mail, label: "Email", value: "connect@aadhaarSeva.org" },
                { icon: Clock, label: "Office Hours", value: "Mon – Sat · 9:00 AM – 6:00 PM IST" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5"
                      style={{ fontFamily: "'DM Mono', monospace" }}>{item.label}</p>
                    <p className="text-foreground font-medium" style={{ fontFamily: "'Lato', sans-serif" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Social */}
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4"
                style={{ fontFamily: "'DM Mono', monospace" }}>Follow Us</p>
              <div className="flex gap-3">
                {[
                  { Icon: Facebook, label: "Facebook" },
                  { Icon: Twitter, label: "Twitter" },
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Youtube, label: "YouTube" },
                  { Icon: MessageCircle, label: "WhatsApp" },
                ].map(({ Icon, label }) => (
                  <button key={label}
                    title={label}
                    className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Send a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {["First Name", "Last Name"].map(f => (
                  <div key={f}>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block"
                      style={{ fontFamily: "'DM Mono', monospace" }}>{f}</label>
                    <input className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                      placeholder={f.split(" ")[0]} />
                  </div>
                ))}
              </div>
              {[
                { label: "Email", type: "email", placeholder: "you@example.com" },
                { label: "Phone (optional)", type: "tel", placeholder: "+91 98765 00000" },
                { label: "Subject", type: "text", placeholder: "Volunteer inquiry" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block"
                    style={{ fontFamily: "'DM Mono', monospace" }}>{f.label}</label>
                  <input type={f.type}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                    placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block"
                  style={{ fontFamily: "'DM Mono', monospace" }}>Message</label>
                <textarea rows={4}
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell us how you'd like to collaborate or support us..." />
              </div>
              <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded hover:opacity-90 transition-opacity"
                style={{ fontFamily: "'Lato', sans-serif" }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl overflow-hidden h-72 bg-muted border border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin size={36} className="mx-auto mb-3 text-primary/40" />
              <p className="font-medium" style={{ fontFamily: "'Lato', sans-serif" }}>AadhaarSeva Foundation</p>
              <p className="text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>47-B, Lajpat Nagar II, New Delhi — 110024</p>
              <p className="text-xs mt-1 text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>Google Maps integration</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
