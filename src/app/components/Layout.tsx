import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { Heart, Menu, X, Facebook, Twitter, Instagram, Youtube, MessageCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EVENTS } from "../data";
import { usePublicAuth } from "../contexts/PublicAuthContext";

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
  const { user } = usePublicAuth();

  return (
    <div className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-black/5 shadow-sm">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <Link to="/" className="flex items-center gap-3 md:gap-4 group">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-md group-hover:shadow-lg transition-all shrink-0 bg-white border border-black/5">
            <img src="/logo.jpeg" alt="Srishreevision Foundation Logo" className="w-full h-full object-contain scale-110" />
          </div>
          <span className="font-bold text-lg md:text-xl tracking-tight text-zinc-900 hidden sm:block uppercase">
            SRISHREEVISION FOUNDATION
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map(l => {
            const active = l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${active ? "text-primary" : "text-zinc-700 hover:text-zinc-900"}`}>
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-full border border-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
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
          <a 
            href="https://wa.me/919701100974?text=I%20wanna%20donate" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm font-bold px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary/90 hover:shadow-lg transition-all active:scale-95 block text-center"
          >
            Donate
          </a>
        </div>

        <button className="md:hidden text-zinc-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-[100%] left-0 right-0 bg-white border-b border-black/10 shadow-xl p-4 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                  className="text-sm font-medium text-zinc-600 py-3 px-4 rounded-xl hover:bg-black/5 hover:text-zinc-900 transition-colors">
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-black/10 my-2" />
              {user ? (
                <Link to="/account" onClick={() => setOpen(false)} className="text-sm font-medium text-zinc-600 py-3 px-4 rounded-xl hover:bg-black/5 hover:text-zinc-900 transition-colors">
                  Account
                </Link>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-zinc-600 py-3 px-4 rounded-xl hover:bg-black/5 hover:text-zinc-900 transition-colors">
                  Login
                </Link>
              )}
              <a 
                href="https://wa.me/919701100974?text=I%20wanna%20donate"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold py-3 mt-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-lg w-full block text-center"
              >
                Donate Now
              </a>
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
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(15,110,110,0.2)] shrink-0 bg-white border border-black/5">
                <img src="/logo.jpeg" alt="Srishreevision Foundation Logo" className="w-full h-full object-contain scale-110" />
              </div>
              <span className="font-bold text-2xl md:text-3xl text-zinc-900 tracking-tight uppercase">SRISHREEVISION FOUNDATION</span>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed max-w-sm mb-8 font-light">
              <strong className="block text-zinc-900 mb-2 font-bold">Local Vision, Global Impact</strong>
              A registered non-profit foundation working in healthcare, education, women empowerment, and community development across Telangana.
            </p>
            <div className="text-zinc-600 text-sm font-light space-y-2">
              <p><strong className="text-zinc-900 font-medium">Phone:</strong>8977910974/ 9701100974 </p>
              <p><strong className="text-zinc-900 font-medium">Email:</strong> srishreefoundation@gmail.com</p>
              <p><strong className="text-zinc-900 font-medium">Address:</strong> 1-11-22,Golnaka Alwal, Alwal, Tirumalagiri, Hyderabad, T.G - 500010</p>
            </div>
          </div>
          {[
            { title: "Quick Links", links: [{ label: "About Us", to: "/about" }, { label: "Our Services", to: "/services" }, { label: "Events", to: "/events" }, { label: "Gallery", to: "/gallery" }, { label: "News", to: "/news" }, { label: "Contact", to: "/contact" }] },
            { title: "Get Involved", links: [{ label: "Volunteer", to: "/contact" }, { label: "Corporate CSR", to: "/contact" }, { label: "Intern with Us", to: "/contact" }, { label: "Fundraise", to: "/contact" }, { label: "Partner NGOs", to: "/contact" }, { label: "Donate", to: "/" }] },
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
        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 text-xs font-light">
            © 2026 Srishreevision Foundation. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Use", "Grievance Redressal"].map(l => (
              <span key={l} className="text-zinc-500 text-xs cursor-pointer hover:text-zinc-900 transition-colors font-light">
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
        href="https://wa.me/919701100974?text=Hi! I would like to know more about Srishreevision Foundation."
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
