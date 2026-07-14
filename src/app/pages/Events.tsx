import { useState } from "react";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { SectionLabel, StatusBadge } from "../components/Layout";
import { EVENTS } from "../data";

type Filter = "all" | "upcoming" | "ongoing" | "completed";

function RegistrationModal({ event, onClose }: { event: typeof EVENTS[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors text-xl font-bold">&times;</button>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Register</h2>
        <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>{event.title}</p>
        <div className="space-y-4">
          {["Full Name", "Email Address", "Phone Number", "City"].map(f => (
            <div key={f}>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block"
                style={{ fontFamily: "'DM Mono', monospace" }}>{f}</label>
              <input className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                placeholder={f} />
            </div>
          ))}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block"
              style={{ fontFamily: "'DM Mono', monospace" }}>Special requirements</label>
            <textarea rows={2} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm outline-none focus:border-primary transition-colors resize-none"
              placeholder="Dietary needs, accessibility, etc." />
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Submit Registration
          </button>
          <p className="text-xs text-center text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>
            Confirmation will be sent via email & WhatsApp within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<typeof EVENTS[0] | null>(null);

  const filtered = filter === "all" ? EVENTS : EVENTS.filter(e => e.status === filter);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-28 bg-foreground relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1400&h=500&fit=crop&auto=format"
          alt="Annual volunteer gathering"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <SectionLabel light>Events</SectionLabel>
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Events & Programs
          </h1>
          <p className="text-primary-foreground/70 max-w-xl mx-auto text-lg leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Join us on the ground — from plantation drives to leadership summits, there is always a way to get involved.
          </p>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3 mb-10">
            {(["all", "upcoming", "ongoing", "completed"] as Filter[]).map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-bold capitalize border transition-colors ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-foreground"}`}
                style={{ fontFamily: "'Lato', sans-serif" }}>
                {f}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(ev => (
              <div key={ev.id}
                className="bg-card rounded-2xl border border-border overflow-hidden group hover:shadow-xl transition-all duration-200">
                <div className="relative h-52 overflow-hidden bg-muted">
                  <img src={ev.banner} alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <StatusBadge status={ev.status} />
                    <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {ev.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg leading-snug mb-3 group-hover:text-primary transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {ev.title}
                  </h3>
                  <div className="space-y-1.5 mb-4">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>
                      <Calendar size={12} className="shrink-0" /> {ev.date}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>
                      <MapPin size={12} className="shrink-0" /> {ev.venue}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>
                      <Clock size={12} className="shrink-0" /> Deadline: {ev.deadline}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {ev.desc}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      style={{ fontFamily: "'DM Mono', monospace" }}>
                      <Users size={12} />
                      {ev.seats > 0 ? `${ev.seats} seats left` : "Completed"}
                    </div>
                    {ev.status !== "completed" && (
                      <button
                        onClick={() => setSelected(ev)}
                        className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
                        style={{ fontFamily: "'Lato', sans-serif" }}>
                        Register <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration modal */}
      {selected && <RegistrationModal event={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
