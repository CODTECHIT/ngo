import { Target, Eye, Award, Heart, Users, Globe, CheckCircle } from "lucide-react";
import { SectionLabel } from "../components/Layout";
import { STATS } from "../data";

const TEAM = [
  { name: "Dr. Kamla Mishra", role: "Founder & Director", img: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=300&h=300&fit=crop&auto=format", bio: "Social entrepreneur and Padma Shri awardee with 25 years in grassroots development." },
  { name: "Suresh Nair", role: "Programs Director", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format", bio: "Former IAS officer, expert in rural development policy and implementation." },
  { name: "Deepa Krishnaswamy", role: "Head — Women Programs", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&auto=format", bio: "Feminist researcher and trainer with 18 years in gender justice advocacy." },
  { name: "Arjun Banerjee", role: "Chief Finance Officer", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format", bio: "CA and chartered public accountant ensuring full financial transparency and compliance." },
];

const MILESTONES = [
  { year: "2009", event: "AadhaarSeva founded in east Delhi with a community kitchen serving 80 families daily." },
  { year: "2012", event: "First skill development centre opened in Jaipur; 200 youth enrolled in Year 1." },
  { year: "2015", event: "FCRA certification received; first international grants from GIZ and UNICEF." },
  { year: "2018", event: "Expanded to 6 states. Women Leadership Programme launched in Maharashtra." },
  { year: "2021", event: "COVID-19 relief operations reached 22,000 families across 4 states in 60 days." },
  { year: "2023", event: "12,000th beneficiary milestone crossed. National NGO Excellence Award received." },
  { year: "2025", event: "Operations in 9 states. 28 active programs. 340+ events organized to date." },
];

export default function About() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden py-28 bg-foreground">
        <img
          src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1400&h=600&fit=crop&auto=format"
          alt="AadhaarSeva team at work"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <SectionLabel light>Our Story</SectionLabel>
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            About AadhaarSeva
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Sixteen years of purposeful action — building livelihoods, restoring dignity,
            and strengthening communities at the grassroots.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>Who We Are</SectionLabel>
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              A Foundation Built on Human Dignity
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4" style={{ fontFamily: "'Lato', sans-serif" }}>
              AadhaarSeva (Foundation for Grassroots Empowerment) is a non-profit organization registered under
              the Societies Registration Act, 1860. We hold 80G and FCRA certifications and operate with complete
              financial transparency audited by a Big Four firm annually.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
              From a modest community kitchen feeding 80 families in 2009, we have grown into a national
              organization with programs spanning skill development, environmental conservation, women's
              empowerment, community infrastructure, social welfare, and policy advocacy.
            </p>
            <ul className="space-y-2">
              {["9 states of operation", "28 active programs", "160+ full-time staff", "3,200+ active volunteers"].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground"
                  style={{ fontFamily: "'Lato', sans-serif" }}>
                  <CheckCircle size={15} className="text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=680&h=520&fit=crop&auto=format"
              alt="Dr. Kamla Mishra with community members"
              className="rounded-2xl shadow-lg w-full object-cover"
            />
            <div className="absolute -bottom-4 -left-4 w-1/2 h-1/2 border-2 border-primary rounded-2xl -z-10" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-primary">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold text-primary-foreground mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
              <p className="text-primary-foreground/70 text-sm uppercase tracking-wide"
                style={{ fontFamily: "'Lato', sans-serif" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>Purpose</SectionLabel>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Mission, Vision & Objectives
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Our Mission", body: "To enable marginalized communities to lead lives of dignity, economic independence, and ecological harmony through inclusive programs, grassroots partnerships, and evidence-based advocacy." },
              { icon: Eye, title: "Our Vision", body: "An India where every citizen — regardless of caste, gender, or geography — has equal access to opportunity, quality healthcare, education, and a clean environment." },
              { icon: Award, title: "Our Objectives", body: "Deliver 30 active programs by 2027 · Reach 25,000 direct beneficiaries annually · Expand to 12 states · Achieve zero overhead ratio above 12% · Open 5 new skill centres." },
            ].map(item => (
              <div key={item.title} className="bg-card rounded-2xl p-8 border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <item.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Message */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionLabel>Founder's Message</SectionLabel>
          <img
            src="https://images.unsplash.com/photo-1494790108755-2616b612b372?w=120&h=120&fit=crop&auto=format"
            alt="Dr. Kamla Mishra"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-6 border-4 border-primary/20"
          />
          <blockquote className="text-2xl md:text-3xl font-bold italic leading-relaxed mb-6 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            "Every program we run, every event we organize, every family we touch — it all begins
            with the belief that every human being deserves a fair start. That belief hasn't changed
            in sixteen years, and it never will."
          </blockquote>
          <p className="text-muted-foreground font-medium" style={{ fontFamily: "'Lato', sans-serif" }}>
            — Dr. Kamla Mishra, Founder & Director, AadhaarSeva Foundation
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-secondary/40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>Our Journey</SectionLabel>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Milestones
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-border md:left-1/2" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className={`flex gap-8 items-start ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`w-28 shrink-0 text-right ${i % 2 !== 0 ? "md:text-left" : ""}`}>
                    <span className="text-sm font-bold text-primary" style={{ fontFamily: "'DM Mono', monospace" }}>{m.year}</span>
                  </div>
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-primary border-2 border-background absolute -left-1.5 top-1.5" />
                  </div>
                  <div className="flex-1 bg-card rounded-xl p-4 border border-border">
                    <p className="text-sm text-foreground leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>Leadership</SectionLabel>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Meet the Team
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="text-center group">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden bg-muted">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                </div>
                <h3 className="font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>{member.name}</h3>
                <p className="text-xs text-primary font-semibold mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>{member.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
