import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { SectionLabel } from "../components/Layout";
import { NEWS } from "../data";

const TAGS = ["All", "Campaign", "Recognition", "Partnership", "Impact", "Community", "Environment"];

export default function News() {
  const [activeTag, setActiveTag] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = NEWS.filter(n => {
    const tagMatch = activeTag === "All" || n.tag === activeTag;
    const queryMatch = !query || n.title.toLowerCase().includes(query.toLowerCase()) || n.excerpt.toLowerCase().includes(query.toLowerCase());
    return tagMatch && queryMatch;
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-28 bg-foreground relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1400&h=500&fit=crop&auto=format"
          alt="News and updates"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <SectionLabel light>Media</SectionLabel>
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            News & Updates
          </h1>
          <p className="text-primary-foreground/70 max-w-xl mx-auto text-lg leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Stories from the field, campaign highlights, partnerships, and organizational milestones.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm w-full outline-none focus:border-primary transition-colors"
                placeholder="Search articles..." />
            </div>
            <div className="flex gap-2 flex-wrap">
              {TAGS.map(t => (
                <button key={t}
                  onClick={() => setActiveTag(t)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${activeTag === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-foreground"}`}
                  style={{ fontFamily: "'Lato', sans-serif" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>
              No articles found for your search.
            </div>
          )}

          {/* Featured */}
          {featured && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-10 grid grid-cols-1 md:grid-cols-2 group cursor-pointer hover:shadow-xl transition-all">
              <div className="h-64 md:h-auto overflow-hidden bg-muted">
                <img src={featured.img} alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-accent/15 text-accent rounded"
                    style={{ fontFamily: "'DM Mono', monospace" }}>
                    {featured.tag}
                  </span>
                  <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>{featured.date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-snug group-hover:text-primary transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  {featured.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {featured.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary"
                  style={{ fontFamily: "'Lato', sans-serif" }}>
                  Read full story <ArrowRight size={14} />
                </span>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rest.map(n => (
              <article key={n.id} className="group bg-card rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                <div className="h-44 overflow-hidden bg-muted">
                  <img src={n.img} alt={n.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 bg-accent/10 text-accent rounded"
                      style={{ fontFamily: "'DM Mono', monospace" }}>
                      {n.tag}
                    </span>
                    <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>{n.date}</span>
                  </div>
                  <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {n.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {n.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary"
                    style={{ fontFamily: "'Lato', sans-serif" }}>
                    Read more <ArrowRight size={11} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
