import { Link } from "react-router";
import { ArrowRight, ChevronDown, ChevronRight, Calendar, MapPin, Heart, Target, Eye, Award, MessageSquare, BookOpen, Leaf, Users, Globe, Shield, Handshake } from "lucide-react";
import { EVENTS, SERVICES, NEWS, GALLERY_IMAGES, TESTIMONIALS, STATS } from "../data";
import { SectionLabel, StatusBadge } from "../components/Layout";

const ICON_MAP: Record<string, React.ElementType> = { BookOpen, Leaf, Users, Globe, Shield, Handshake };

// ── Event Ad Banner ────────────────────────────────────────────────────────────
function EventAdBanner({ event }: { event: typeof EVENTS[0] }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-border group cursor-pointer bg-muted">
      <img src={event.banner} alt={event.title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
      <div className="absolute top-3 left-3 flex gap-2">
        <StatusBadge status={event.status} />
        <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
          {event.category}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-white font-bold text-sm leading-snug mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {event.title}
        </p>
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1 text-white/80 text-xs" style={{ fontFamily: "'Lato', sans-serif" }}>
            <Calendar size={10} /> {event.date}
          </span>
          <span className="flex items-center gap-1 text-white/80 text-xs" style={{ fontFamily: "'Lato', sans-serif" }}>
            <MapPin size={10} /> {event.venue}
          </span>
        </div>
        <Link to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground px-4 py-1.5 rounded hover:opacity-90 transition-opacity"
          style={{ fontFamily: "'Lato', sans-serif" }}>
          Register Now <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}

// ── Sections ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="bg-background" />
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900&h=900&fit=crop&auto=format"
            alt="Community members working together for social change"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/30" />
        </div>
      </div>
      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-24">
        <div>
          <SectionLabel>Est. 2009 · New Delhi, India</SectionLabel>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Rooting Change,<br />
            <em className="not-italic text-primary">One Life</em><br />
            at a Time.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            AadhaarSeva empowers marginalized communities through skill-building,
            environmental action, women-led initiatives, and grassroots development
            across rural and urban India.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/services"
              className="flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition-opacity"
              style={{ fontFamily: "'Lato', sans-serif" }}>
              Our Programs <ArrowRight size={16} />
            </Link>
            <Link to="/about"
              className="flex items-center gap-2 px-7 py-3.5 border-2 border-foreground text-foreground rounded font-bold hover:bg-secondary transition-colors"
              style={{ fontFamily: "'Lato', sans-serif" }}>
              About Us <ChevronRight size={16} />
            </Link>
          </div>
        </div>
        <div className="hidden md:flex justify-center items-end pb-12">
          <div className="bg-card/95 backdrop-blur rounded-2xl p-6 shadow-2xl max-w-xs w-full mb-8">
            <p className="text-xs font-bold tracking-widest uppercase text-accent mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}>
              Impact This Year
            </p>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5" style={{ fontFamily: "'Lato', sans-serif" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground animate-bounce">
        <ChevronDown size={20} />
      </div>
    </section>
  );
}

function ImpactStats() {
  return (
    <section className="bg-primary py-14">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map(s => (
          <div key={s.label} className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-primary-foreground mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {s.value}
            </p>
            <p className="text-primary-foreground/70 text-sm tracking-wide uppercase"
              style={{ fontFamily: "'Lato', sans-serif" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EventAds() {
  const ads = EVENTS.filter(e => e.status !== "completed").slice(0, 3);
  return (
    <section className="py-16 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <SectionLabel>Don't Miss</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Upcoming Events
            </h2>
          </div>
          <Link to="/events"
            className="flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-2.5 transition-all"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            All Events <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ads.map(ev => <EventAdBanner key={ev.id} event={ev} />)}
        </div>
      </div>
    </section>
  );
}

function AboutPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=680&h=520&fit=crop&auto=format"
            alt="Founder meeting with community members"
            className="rounded-2xl w-full object-cover shadow-lg"
          />
          <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border-2 border-accent rounded-2xl -z-10" />
          <div className="absolute top-6 -right-6 bg-card rounded-xl shadow-lg p-4 max-w-[160px] text-center">
            <Award size={24} className="text-accent mx-auto mb-1" />
            <p className="text-xs font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Dr. Kamla Mishra</p>
            <p className="text-[10px] text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>Founder & Director</p>
          </div>
        </div>
        <div>
          <SectionLabel>About Us</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Sixteen Years of<br />Purposeful Change
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-5"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Founded in 2009 by Dr. Kamla Mishra, AadhaarSeva has grown from a small
            community kitchen in east Delhi into a nationally recognized non-profit
            operating across nine states — working at the intersection of human
            dignity, livelihood, and environmental stewardship.
          </p>
          <div className="grid grid-cols-1 gap-3 mb-8">
            {[
              { icon: Target, title: "Mission", body: "Enable marginalized communities to lead lives of dignity, economic independence, and ecological harmony." },
              { icon: Eye, title: "Vision", body: "An India where every citizen has equal access to opportunity, healthcare, and a clean environment." },
            ].map(item => (
              <div key={item.title} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/about"
            className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all w-fit"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Read Founder's Message <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServicesPreview() {
  return (
    <section className="py-24 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Our Programs</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            What We Do
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto" style={{ fontFamily: "'Lato', sans-serif" }}>
            Six flagship program streams, each designed to address a root cause of social inequality.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(s => {
            const Icon = ICON_MAP[s.icon];
            return (
              <div key={s.title}
                className="group bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
                  <Icon size={20} className={s.textColor} />
                </div>
                <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {s.desc}
                </p>
                <Link to="/services"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ fontFamily: "'Lato', sans-serif" }}>
                  Learn more <ArrowRight size={11} />
                </Link>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <Link to="/services"
            className="px-8 py-3 border-2 border-foreground text-foreground rounded font-bold hover:bg-foreground hover:text-background transition-colors text-sm inline-block"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Explore All Programs
          </Link>
        </div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  return (
    <section className="py-24 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <SectionLabel>Gallery</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Moments of Impact
            </h2>
          </div>
          <Link to="/gallery"
            className="flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-2.5 transition-all"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Full Gallery <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY_IMAGES.slice(0, 6).map((img, i) => (
            <div key={i} className="relative group overflow-hidden rounded-xl bg-muted aspect-[4/3]">
              <img src={img.src} alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-end p-3">
                <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ fontFamily: "'Lato', sans-serif" }}>
                  {img.alt}
                </span>
              </div>
              <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                {img.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.18em] uppercase text-primary-foreground/60 mb-4 block"
            style={{ fontFamily: "'Lato', sans-serif" }}>Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}>Voices of Change</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-primary-foreground/10 backdrop-blur rounded-2xl p-6 border border-primary-foreground/20">
              <MessageSquare size={22} className="text-primary-foreground/40 mb-4" />
              <p className="text-primary-foreground/90 text-sm leading-relaxed mb-5 italic"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-muted" />
                <div>
                  <p className="text-primary-foreground font-bold text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{t.name}</p>
                  <p className="text-primary-foreground/60 text-xs" style={{ fontFamily: "'Lato', sans-serif" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel>News & Updates</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Latest from the Field
            </h2>
          </div>
          <Link to="/news" className="flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-2.5 transition-all"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            All Articles <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS.slice(0, 3).map(n => (
            <article key={n.id} className="group border-t-2 border-border hover:border-primary transition-colors pt-6 cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-accent/10 text-accent rounded"
                  style={{ fontFamily: "'DM Mono', monospace" }}>{n.tag}</span>
                <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>{n.date}</span>
              </div>
              <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}>{n.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>{n.excerpt}</p>
              <Link to="/news" className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-primary"
                style={{ fontFamily: "'Lato', sans-serif" }}>
                Read more <ArrowRight size={11} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DonationBanner() {
  return (
    <section className="py-16 bg-accent">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Every Rupee Plants a Seed of Change
          </h2>
          <p className="text-accent-foreground/80 max-w-xl" style={{ fontFamily: "'Lato', sans-serif" }}>
            Your donation directly funds programs — no inflated overheads. 80G tax exemption available.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="px-8 py-3.5 bg-foreground text-background font-bold rounded hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Donate Now
          </button>
          <Link to="/about" className="px-6 py-3.5 border-2 border-foreground text-accent-foreground font-bold rounded hover:bg-foreground/10 transition-colors"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Learn How
          </Link>
        </div>
      </div>
    </section>
  );
}

function ContactPreview() {
  return (
    <section className="py-20 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <SectionLabel>Get in Touch</SectionLabel>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            We'd Love to Hear from You
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
            Whether you want to volunteer, partner, donate, or simply learn more — our team is just a message away.
          </p>
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Contact Us <ArrowRight size={16} />
          </Link>
        </div>
        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <div className="space-y-4">
            {["Your Name", "Email Address"].map(f => (
              <input key={f}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                placeholder={f} />
            ))}
            <textarea rows={3}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm outline-none focus:border-primary transition-colors resize-none"
              placeholder="Your message..." />
            <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded hover:opacity-90 transition-opacity"
              style={{ fontFamily: "'Lato', sans-serif" }}>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <ImpactStats />
      <EventAds />
      <AboutPreview />
      <ServicesPreview />
      <GalleryPreview />
      <TestimonialsSection />
      <NewsPreview />
      <DonationBanner />
      <ContactPreview />
    </>
  );
}
