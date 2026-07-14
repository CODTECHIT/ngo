import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { Heart, Menu, X, Facebook, Twitter, Instagram, Youtube, MessageCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EVENTS } from "../data";

const upcomingEvents = EVENTS.filter(e => e.status === "upcoming" || e.status === "ongoing");

export function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 mb-6 ${className || ''}`}>
      <span className="h-[2px] w-8 bg-gradient-to-r from-primary to-accent" />
      <span className="text-xs font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
        {children}
      </span>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    upcoming: "bg-primary/20 text-primary border-primary/30",
    ongoing: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    completed: "bg-white/5 text-white/50 border-white/10",
    confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${map[status] ?? "bg-white/5 text-white/50 border-white/10"}`}>
      {status}
    </span>
  );
}

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Events", to: "/events" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

function FloatingIslandNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`w-full max-w-5xl rounded-full border transition-all duration-500 flex items-center justify-between px-6 py-3 ${scrolled ? 'bg-black/60 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : 'bg-transparent border-transparent'}`}>
        
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all">
            <Heart size={18} className="text-white" fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
            LEAD TO SERVE
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
          {NAV_LINKS.map(l => {
            const active = l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${active ? "text-white" : "text-white/60 hover:text-white"}`}>
                {active && (
                  <motion.div 
                    layoutId="island-indicator"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/20" 
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm font-bold px-6 py-2.5 rounded-full bg-white text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all active:scale-95">
            Donate
          </button>
        </div>
        
        <button className="md:hidden text-white w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-20 left-4 right-4 bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-4 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                  className="text-sm font-medium text-white/80 py-3 px-4 rounded-xl hover:bg-white/10 hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <button className="text-sm font-bold py-3 mt-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-lg w-full">
                Donate Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white py-24 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <Heart size={20} className="text-white" fill="currentColor" />
              </div>
              <span className="font-bold text-3xl text-white tracking-tight">LEAD TO SERVE</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-8 font-light">
              Foundation for Grassroots Empowerment — registered under the Societies Registration Act, 1860. 80G & FCRA certified. Building futures through technology and compassion.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube, MessageCircle].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-primary hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all hover:-translate-y-1">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
          {[
            { title: "Quick Links", links: [{ label: "About Us", to: "/about" }, { label: "Our Services", to: "/services" }, { label: "Events", to: "/events" }, { label: "Gallery", to: "/gallery" }, { label: "News", to: "/news" }, { label: "Contact", to: "/contact" }] },
            { title: "Get Involved", links: [{ label: "Volunteer", to: "/contact" }, { label: "Corporate CSR", to: "/contact" }, { label: "Intern with Us", to: "/contact" }, { label: "Fundraise", to: "/contact" }, { label: "Partner NGOs", to: "/contact" }, { label: "Donate", to: "/" }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-white/50 mb-6">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-zinc-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <ArrowRight size={12} className="opacity-0 -translate-x-2 text-primary group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 text-xs font-light">
            © 2025 LEAD TO SERVE Foundation. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Use", "Grievance Redressal"].map(l => (
              <span key={l} className="text-zinc-500 text-xs cursor-pointer hover:text-white transition-colors font-light">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 selection:text-white">
      <FloatingIslandNav />
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <Footer />
      <a 
        href="https://wa.me/919999999999?text=Hi! I would like to know more about LEAD TO SERVE."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all cursor-pointer"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle size={28} fill="currentColor" />
      </a>
    </div>
  );
}
