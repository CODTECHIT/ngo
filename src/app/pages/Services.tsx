import { ArrowRight, BookOpen, Leaf, Users, Globe, Shield, Handshake, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { SectionLabel } from "../components/Layout";
import { SERVICES } from "../data";

const ICON_MAP: Record<string, React.ElementType> = { BookOpen, Leaf, Users, Globe, Shield, Handshake };

const EXTRA_INFO: Record<string, string[]> = {
  "Skill Development": ["Free certification upon completion", "Placement assistance provided", "Industry-aligned curriculum", "Available in 14 cities"],
  "Environmental Awareness": ["1.2M saplings planted to date", "220 Green Schools enrolled", "80+ municipal partnerships", "Annual drives in 9 states"],
  "Women Empowerment": ["3,200 active SHG members", "Micro-finance linkages", "Free legal aid camps", "Business incubation support"],
  "Community Development": ["140+ projects completed", "Solar lighting & sanitation", "Co-designed with residents", "Government scheme integration"],
  "Social Welfare": ["18,000 nutrition packets/month", "4 shelter homes operated", "2 old-age care centres", "Emergency relief network"],
  "Training Workshops": ["450+ workshops annually", "38,000+ participants", "All workshops free of charge", "Expert facilitators"],
};

export default function Services() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-28 bg-foreground relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&h=500&fit=crop&auto=format"
          alt="Community training in progress"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <SectionLabel light>Programs</SectionLabel>
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Our Services
          </h1>
          <p className="text-primary-foreground/70 max-w-xl mx-auto text-lg leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Six interconnected program streams that together address the root causes of social inequality — not just its symptoms.
          </p>
        </div>
      </section>

      {/* Services detail */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {SERVICES.map((s, i) => {
            const Icon = ICON_MAP[s.icon];
            const extras = EXTRA_INFO[s.title] ?? [];
            const reversed = i % 2 !== 0;
            return (
              <div key={s.slug}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reversed ? "" : ""}`}>
                <div className={reversed ? "md:order-2" : ""}>
                  <div className={`inline-flex w-14 h-14 rounded-2xl ${s.color} items-center justify-center mb-5`}>
                    <Icon size={26} className={s.textColor} />
                  </div>
                  <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {s.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-5" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {s.details}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {extras.map(e => (
                      <li key={e} className="flex items-center gap-2 text-sm text-foreground"
                        style={{ fontFamily: "'Lato', sans-serif" }}>
                        <CheckCircle size={14} className="text-primary shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded font-bold text-sm hover:opacity-90 transition-opacity"
                    style={{ fontFamily: "'Lato', sans-serif" }}>
                    Get Involved <ArrowRight size={14} />
                  </Link>
                </div>
                <div className={`rounded-2xl overflow-hidden bg-muted ${reversed ? "md:order-1" : ""}`}>
                  <div className={`h-72 ${s.color} flex items-center justify-center`}>
                    <Icon size={100} className={`${s.textColor} opacity-20`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Want to Collaborate or Volunteer?
          </h2>
          <p className="text-accent-foreground/80 mb-8 max-w-xl mx-auto" style={{ fontFamily: "'Lato', sans-serif" }}>
            Whether you're an individual wanting to contribute time or a corporate looking for CSR partnerships, we'd love to connect.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/contact"
              className="px-8 py-3.5 bg-foreground text-background font-bold rounded hover:opacity-90 transition-opacity"
              style={{ fontFamily: "'Lato', sans-serif" }}>
              Contact Us
            </Link>
            <Link to="/events"
              className="px-8 py-3.5 border-2 border-foreground text-accent-foreground font-bold rounded hover:bg-foreground/10 transition-colors"
              style={{ fontFamily: "'Lato', sans-serif" }}>
              See Upcoming Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
