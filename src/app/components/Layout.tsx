import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { Heart, Menu, X, Facebook, Twitter, Instagram, Youtube, MessageCircle, ArrowRight, Phone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EVENTS } from "../data";
import { usePublicAuth } from "../contexts/PublicAuthContext";
import { HeaderTicker } from "./HeaderTicker";
import { WelcomePopup } from "./WelcomePopup";
import { StickyNotes } from "./StickyNotes";
import { ScrollDonationPrompt } from "./ScrollDonationPrompt";

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
    completed: "bg-black/5 text-zinc-500 border-black/10",
    confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${map[status] ?? "bg-black/5 text-zinc-500 border-black/10"}`}>
      {status}
    </span>
  );
}

interface NavItem {
  label: string;
  to: string;
  children?: { label: string; to: string; desc?: string }[];
}

const NAV_LINKS: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About",
    to: "/about",
    children: [
      { label: "Overview & Mission", to: "/about", desc: "Our story, vision & impact" },
      { label: "Leadership & Directors", to: "/about#leadership", desc: "Meet our governing board" },
      { label: "Legal & Certifications", to: "/legal", desc: "12A, 80G & FCRA details" }
    ]
  },
  {
    label: "Services",
    to: "/services",
    children: [
      { label: "All Community Services", to: "/services", desc: "Healthcare, education & welfare" },
      { label: "Nasha Mukt Abhiyaan", to: "/nasha-mukt-pledge", desc: "Drug-free youth drive" },
      { label: "Netra Suraksha Abhiyaan", to: "/netra-suraksha-pledge", desc: "Eye care & donation initiative" }
    ]
  },
  {
    label: "Events",
    to: "/events",
    children: [
      { label: "Upcoming Events", to: "/events", desc: "Medical camps & youth drives" },
      { label: "Volunteer Drive", to: "/apply", desc: "Join as a community volunteer" }
    ]
  },
  {
    label: "News",
    to: "/news",
    children: [
      { label: "Press Releases & Articles", to: "/news", desc: "Media coverage & updates" },
      { label: "Verify Certificate", to: "/verify-certificate", desc: "Authenticate pledge certificates" }
    ]
  },
  {
    label: "Gallery",
    to: "/gallery",
    children: [
      { label: "Photo Gallery", to: "/gallery", desc: "Field action & event photos" }
    ]
  },
  {
    label: "Contact",
    to: "/contact",
    children: [
      { label: "Get In Touch", to: "/contact", desc: "Contact details & map" },
      { label: "Apply as Volunteer", to: "/apply", desc: "Join our volunteer network" },
      { label: "Support & Donate", to: "/donate", desc: "Make a direct contribution" }
    ]
  }
];

function FloatingIslandNav() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { user } = usePublicAuth();

  return (
    <div className="relative z-40 w-full bg-white backdrop-blur-md border-b border-black/5 shadow-sm">

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        <Link to="/" className="flex items-center gap-3 md:gap-4 group">
          <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/logo.jpeg" alt="Srishreevision Foundation Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-lg md:text-xl tracking-tight text-zinc-900 hidden sm:block uppercase">
            SRISHREEVISION FOUNDATION
          </span>
        </Link>


        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => {
            const active = l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);
            const hasChildren = l.children && l.children.length > 0;

            return (
              <div
                key={l.label}
                className="relative"
                onMouseEnter={() => hasChildren && setActiveDropdown(l.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={l.to}
                  className={`relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${active ? "text-primary font-bold" : "text-zinc-700 hover:text-zinc-900"}`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-full border border-primary/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                  {hasChildren && (
                    <ChevronDown className={`w-3.5 h-3.5 relative z-10 transition-transform ${activeDropdown === l.label ? 'rotate-180 text-primary' : 'text-zinc-400'}`} />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {hasChildren && (
                  <AnimatePresence>
                    {activeDropdown === l.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 overflow-hidden"
                      >
                        <div className="space-y-0.5">
                          {l.children!.map((child) => (
                            <Link
                              key={child.to}
                              to={child.to}
                              onClick={() => setActiveDropdown(null)}
                              className="block p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group"
                            >
                              <div className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                                {child.label}
                              </div>
                              {child.desc && (
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {child.desc}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>


        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to="/account" className="text-sm font-bold px-4 py-2 text-zinc-600 hover:text-zinc-900 transition-colors">
              {user.user_metadata?.full_name?.split(' ')[0] || user.user_metadata?.name?.split(' ')[0] || 'Account'}
            </Link>
          ) : (
            <Link to="/login" className="text-sm font-bold px-4 py-2 text-zinc-600 hover:text-zinc-900 transition-colors">
              Login
            </Link>
          )}
          <Link
            to="/donate"
            className="donate-dance donate-shine text-sm font-bold px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary/90 hover:shadow-lg transition-all active:scale-95 block text-center"
          >
            Donate
          </Link>
        </div>

        <button className="md:hidden text-zinc-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.header>

      {/* Sub-Header Campaign Pledge Bar with Distinct Colored Buttons */}
      <div className="bg-slate-900 text-white py-2.5 px-4 border-t border-slate-800 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Free Campaign Pledges & Certification
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            {/* Orange Button: Nasha Mukt Pledge */}
            <Link
              to="/nasha-mukt-pledge"
              className="flex-1 sm:flex-initial px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold shadow-md hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 text-xs border border-orange-400/30"
            >
              <span>🚫</span> Nasha Mukt Pledge & Certificate
            </Link>

            {/* Cyan/Teal Button: Netra Suraksha Pledge */}
            <Link
              to="/netra-suraksha-pledge"
              className="flex-1 sm:flex-initial px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold shadow-md hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-1.5 text-xs border border-teal-400/30"
            >
              <span>👁️</span> Netra Suraksha Pledge & Certificate
            </Link>
          </div>
        </div>
      </div>


      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-[100%] left-0 right-0 bg-white border-b border-black/10 shadow-xl p-4 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(l => (
                <div key={l.label} className="space-y-1">
                  <Link to={l.to} onClick={() => setOpen(false)}
                    className="text-sm font-bold text-zinc-900 py-2 px-3 rounded-xl hover:bg-black/5 flex items-center justify-between transition-colors">
                    <span>{l.label}</span>
                  </Link>
                  {l.children && (
                    <div className="pl-3 space-y-0.5 border-l-2 border-slate-200 my-0.5">
                      {l.children.map(child => (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setOpen(false)}
                          className="block text-xs font-medium text-slate-600 hover:text-primary py-1.5 px-2 rounded-lg hover:bg-slate-50 transition"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="h-px bg-black/10 my-2" />
              <div className="flex flex-col gap-2 my-1">
                <Link
                  to="/nasha-mukt-pledge"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>🚫</span> Nasha Mukt Pledge & Certificate
                </Link>
                <Link
                  to="/netra-suraksha-pledge"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>👁️</span> Netra Suraksha Pledge & Certificate
                </Link>
              </div>
              <div className="h-px bg-black/10 my-1" />
              {user ? (
                <Link to="/account" onClick={() => setOpen(false)} className="text-sm font-medium text-zinc-600 py-3 px-4 rounded-xl hover:bg-black/5 hover:text-zinc-900 transition-colors">
                  Account
                </Link>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-zinc-600 py-3 px-4 rounded-xl hover:bg-black/5 hover:text-zinc-900 transition-colors">
                  Login
                </Link>
              )}
              <Link
                to="/donate"
                onClick={() => setOpen(false)}
                className="donate-dance donate-shine text-sm font-bold py-3 mt-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-lg w-full block text-center"
              >
                Donate Now
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-background text-foreground py-12 md:py-24 px-4 md:px-6 border-t border-black/10 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                <img src="/logo.jpeg" alt="Srishreevision Foundation Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-xl sm:text-2xl md:text-3xl text-zinc-900 tracking-tight uppercase leading-tight">SRISHREEVISION FOUNDATION</span>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed max-w-sm mb-8 font-light">
              <strong className="block text-zinc-900 mb-2 font-bold">Local Vision, Global Impact</strong>
              A registered non-profit foundation working in healthcare, education, women empowerment and community development across Telangana.
            </p>
            <div className="text-zinc-600 text-sm font-light space-y-2">
              <p><strong className="text-zinc-900 font-medium">Phone:</strong>8977910974/ 9701100974 </p>
              <p><strong className="text-zinc-900 font-medium">Email:</strong> srishreefoundation@gmail.com</p>
              <p><strong className="text-zinc-900 font-medium">Address:</strong> 1-11-22,Golnaka Alwal, Alwal, Tirumalagiri, Hyderabad, T.G - 500010</p>
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
            {[
              { title: "Quick Links", links: [{ label: "About Us", to: "/about" }, { label: "Our Services", to: "/services" }, { label: "Events", to: "/events" }, { label: "News", to: "/news" }, { label: "Gallery", to: "/gallery" }, { label: "Contact", to: "/contact" }] },
              { title: "Get Involved", links: [{ label: "Volunteer", to: "/apply?category=volunteer" }, { label: "Corporate CSR", to: "/apply?category=csr" }, { label: "Intern with Us", to: "/apply?category=intern" }, { label: "Fundraise", to: "/apply?category=fundraise" }, { label: "Partner NGOs", to: "/apply?category=partner" }, { label: "Donate", to: "/donate" }] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-zinc-400 mb-6">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-zinc-600 hover:text-zinc-900 text-sm transition-colors flex items-center gap-2 group">
                        <ArrowRight size={12} className="opacity-0 -translate-x-2 text-primary group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        <span className="group-hover:translate-x-1 transition-transform">{l.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-zinc-500 text-xs font-light">
              © 2026 Srishreevision Foundation. All rights reserved.
            </p>
            <p className="text-zinc-500 text-xs font-light">
              Developed by <a href="https://codtechitsolutions.com/" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">CODTECH IT SOLUTIONS</a>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: "Privacy Policy", hash: "privacy" },
              { label: "Terms of Use", hash: "terms" },
              { label: "Grievance Redressal", hash: "grievance" },
            ].map(l => (
              <Link key={l.label} to={`/legal#${l.hash}`} className="text-zinc-500 text-xs hover:text-zinc-900 transition-colors font-light">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 selection:text-white">
      <WelcomePopup />
      <StickyNotes />
      <ScrollDonationPrompt />
      <HeaderTicker />
      <FloatingIslandNav />
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <Footer />
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        <a
          href="tel:+918977910974"
          className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(15,110,110,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(15,110,110,0.6)] transition-all cursor-pointer"
          title="Call us now"
        >
          <Phone size={26} />
        </a>
        <a
          href="https://wa.me/918977910974?text=Hi! I would like to know more about Srishreevision Foundation."
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all cursor-pointer"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle size={28} fill="currentColor" />
        </a>
      </div>
    </div>
  );
}
