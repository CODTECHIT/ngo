import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { Heart, Menu, X, Facebook, Twitter, Instagram, Youtube, MessageCircle, ArrowRight } from "lucide-react";
import { EVENTS } from "../data";

const upcomingEvents = EVENTS.filter(e => e.status === "upcoming" || e.status === "ongoing");

export function SectionLabel({ children, light }: { children: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className={`h-px w-8 ${light ? "bg-primary-foreground/40" : "bg-accent"}`} />
      <span
        className={`text-xs font-bold tracking-[0.18em] uppercase ${light ? "text-primary-foreground/60" : "text-accent"}`}
        style={{ fontFamily: "'Lato', sans-serif" }}>
        {children}
      </span>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-emerald-100 text-emerald-800",
    completed: "bg-stone-100 text-stone-600",
    confirmed: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function Marquee() {
  const text = upcomingEvents.map(e => `🔔 ${e.title} — ${e.date} · ${e.venue}`).join("     ·     ");
  return (
    <div className="bg-primary text-primary-foreground overflow-hidden py-1.5 relative">
      <div
        className="flex gap-0 whitespace-nowrap"
        style={{ animation: "marquee 55s linear infinite" }}>
        <span className="text-xs pr-16" style={{ fontFamily: "'Lato', sans-serif" }}>{text}</span>
        <span className="text-xs pr-16" style={{ fontFamily: "'Lato', sans-serif" }}>{text}</span>
        <span className="text-xs pr-16" style={{ fontFamily: "'Lato', sans-serif" }}>{text}</span>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Events", to: "/events" },
  { label: "Gallery", to: "/gallery" },
  { label: "News", to: "/news" },
  { label: "Contact", to: "/contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Heart size={14} className="text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-bold text-lg leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
            AadhaarSeva
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(l => {
            const active = l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to}
                className={`text-sm transition-colors relative pb-0.5 ${active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                style={{ fontFamily: "'Lato', sans-serif" }}>
                {l.label}
                {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/admin"
            className="text-xs font-semibold px-4 py-2 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Admin
          </Link>
          <button className="text-xs font-bold px-5 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Donate Now
          </button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-card border-t border-border px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="text-sm text-foreground py-1 border-b border-border last:border-0"
              style={{ fontFamily: "'Lato', sans-serif" }}>
              {l.label}
            </Link>
          ))}
          <Link to="/admin" onClick={() => setOpen(false)}
            className="text-sm text-muted-foreground py-1">Admin Panel</Link>
          <button className="text-sm font-bold px-5 py-2 rounded bg-primary text-primary-foreground w-fit mt-1">Donate Now</button>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Heart size={14} className="text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>AadhaarSeva</span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs mb-5"
              style={{ fontFamily: "'Lato', sans-serif" }}>
              Foundation for Grassroots Empowerment — registered under the Societies Registration Act, 1860. 80G & FCRA certified.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube, MessageCircle].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/20 transition-colors">
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>
          {[
            { title: "Quick Links", links: [{ label: "About Us", to: "/about" }, { label: "Our Services", to: "/services" }, { label: "Events", to: "/events" }, { label: "Gallery", to: "/gallery" }, { label: "News", to: "/news" }, { label: "Contact", to: "/contact" }] },
            { title: "Get Involved", links: [{ label: "Volunteer", to: "/contact" }, { label: "Corporate CSR", to: "/contact" }, { label: "Intern with Us", to: "/contact" }, { label: "Fundraise", to: "/contact" }, { label: "Partner NGOs", to: "/contact" }, { label: "Donate", to: "/" }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-4"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors"
                      style={{ fontFamily: "'Lato', sans-serif" }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/40 text-xs" style={{ fontFamily: "'Lato', sans-serif" }}>
            © 2025 AadhaarSeva Foundation. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Use", "Grievance Redressal"].map(l => (
              <span key={l} className="text-primary-foreground/40 text-xs cursor-pointer hover:text-primary-foreground/60 transition-colors"
                style={{ fontFamily: "'Lato', sans-serif" }}>
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
    <div className="min-h-screen bg-background flex flex-col">
      <Marquee />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
