import { useState } from "react";
import { X } from "lucide-react";
import { SectionLabel } from "../components/Layout";
import { GALLERY_IMAGES } from "../data";

export default function Gallery() {
  const [activeTag, setActiveTag] = useState("All");
  const [lightbox, setLightbox] = useState<typeof GALLERY_IMAGES[0] | null>(null);

  const tags = ["All", ...Array.from(new Set(GALLERY_IMAGES.map(g => g.tag)))];
  const shown = activeTag === "All" ? GALLERY_IMAGES : GALLERY_IMAGES.filter(g => g.tag === activeTag);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-28 bg-foreground relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1400&h=500&fit=crop&auto=format"
          alt="Community volunteers"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <SectionLabel light>Visual Story</SectionLabel>
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Gallery
          </h1>
          <p className="text-primary-foreground/70 max-w-xl mx-auto text-lg leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Photographs and videos from our programs, events, and communities — moments that words alone cannot capture.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-3 flex-wrap justify-center mb-10">
            {tags.map(t => (
              <button key={t}
                onClick={() => setActiveTag(t)}
                className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${activeTag === t ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-foreground"}`}
                style={{ fontFamily: "'Lato', sans-serif" }}>
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {shown.map((img, i) => (
              <div key={i}
                onClick={() => setLightbox(img)}
                className="relative group overflow-hidden rounded-2xl bg-muted cursor-pointer aspect-[4/3]">
                <img src={img.src} alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-colors flex items-center justify-center">
                  <span className="text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity text-center px-4"
                    style={{ fontFamily: "'Lato', sans-serif" }}>
                    {img.alt}
                  </span>
                </div>
                <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {img.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src.replace("w=600&h=450", "w=900&h=680")} alt={lightbox.alt}
              className="w-full rounded-2xl shadow-2xl" />
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-foreground/80 to-transparent rounded-b-2xl">
              <p className="text-white font-medium" style={{ fontFamily: "'Lato', sans-serif" }}>{lightbox.alt}</p>
              <span className="text-xs text-white/60 bg-black/40 px-2 py-0.5 rounded-full">{lightbox.tag}</span>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/40 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
