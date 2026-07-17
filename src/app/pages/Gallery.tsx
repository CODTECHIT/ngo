import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionLabel } from "../components/Layout";
import { useGallery, GalleryImage } from "../hooks/useGallery";

// ── Shared Animation Variants ──────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Gallery() {
  const { images, loading } = useGallery();
  const [activeTag, setActiveTag] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const tags = ["All", ...Array.from(new Set(images.map(g => g.category)))];
  const shown = activeTag === "All" ? images : images.filter(g => g.category === activeTag);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden flex items-center justify-center md:min-h-[60vh]">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none">
          <div className="absolute -top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_alternate]" />
        </div>
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-multiply z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center">
            <SectionLabel>Visual Story</SectionLabel>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-600 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Photographs and videos from our programs, events, and communities — moments that words alone cannot capture.
          </motion.p>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-3 flex-wrap justify-center mb-16">
            {tags.map(t => (
              <button key={t}
                onClick={() => setActiveTag(t)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${activeTag === t ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(15,110,110,0.2)]" : "border-black/5 text-zinc-500 hover:text-zinc-900 hover:border-black/20 bg-black/[0.02]"}`}>
                {t}
              </button>
            ))}
          </motion.div>
          <motion.div 
            key={activeTag} 
            initial="hidden" animate="visible" variants={staggerContainer} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.length > 0 ? (
              shown.map((img, i) => {
                const isVideo = img.image_url?.match(/\.(mp4|webm)$/i) || img.image_url?.includes('/video/upload/');
                return (
                  <motion.div variants={fadeIn} key={img.id}>
                    <div
                      onClick={() => setLightbox(img)}
                      className="relative group overflow-hidden rounded-3xl bg-black/5 cursor-pointer aspect-[4/3] border border-black/5 hover:border-black/20 hover:shadow-[0_0_20px_rgba(0,0,0,0.05)] transition-all duration-500">
                      {isVideo ? (
                        <video src={img.image_url} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                      ) : (
                        <img src={img.image_url} alt={img.caption || "Gallery Image"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-white font-bold text-lg leading-snug line-clamp-2">
                          {img.caption || img.category}
                        </span>
                      </div>
                      <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        {img.category}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            ) : !loading ? (
              <div className="col-span-full py-20 text-center text-zinc-500 bg-black/5 rounded-3xl border border-dashed border-black/10">
                There are no photos or videos in the gallery yet.
              </div>
            ) : null}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black flex items-center justify-center min-h-[50vh]" 
              onClick={e => e.stopPropagation()}>
              
              {lightbox.image_url?.match(/\.(mp4|webm)$/i) || lightbox.image_url?.includes('/video/upload/') ? (
                <video src={lightbox.image_url} controls autoPlay className="w-full h-auto max-h-[80vh] object-contain" />
              ) : (
                <img src={lightbox.image_url} alt={lightbox.caption || "Gallery Image"}
                  className="w-full h-auto max-h-[80vh] object-contain bg-transparent" />
              )}
              
              <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
                <p className="text-white font-bold text-xl mb-2">{lightbox.caption || lightbox.category}</p>
                <span className="text-[10px] text-accent font-bold uppercase tracking-widest border border-accent/20 bg-accent/10 px-3 py-1 rounded-full">{lightbox.category}</span>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 border border-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all">
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
