import { useState } from "react";
import { motion } from "motion/react";

export const PARTNERS = [
  { name: "Srishreevision Foundation", role: "Our Foundation", logo: "/logo.jpeg" },
  { name: "iCare Vision Center", role: "Eye Care Partner", logo: "" },
  { name: "Lions Clubs International", role: "Community Partner", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Lions_Clubs_International_logo.svg/330px-Lions_Clubs_International_logo.svg.png" },
  { name: "Telangana Police", role: "Public Safety Partner", logo: "https://upload.wikimedia.org/wikipedia/en/0/01/Telangana_Police_Logo.png" },
  { name: "TGNAB", role: "Awareness Partner", logo: "" },
  { name: "Hindu Jagarana Mancha", role: "Health Camp Partner", logo: "https://hindujagranmanch.in/wp-content/uploads/2026/04/cropped-favicon-hindu-jagran-munch-1.png" },
];

function PartnerLogo({ partner }: { partner: typeof PARTNERS[number] }) {
  const [failed, setFailed] = useState(false);
  const initials = partner.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  return (
    <div className="mx-4 md:mx-6 shrink-0">
      <div className="flex items-center gap-3 bg-white border border-black/10 rounded-2xl px-6 md:px-8 py-4 hover:border-primary/40 hover:shadow-[0_0_25px_rgba(15,110,110,0.1)] transition-all">
        {partner.logo && !failed ? (
          <img
            src={partner.logo}
            alt={partner.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-9 md:h-11 w-auto max-w-[100px] md:max-w-[120px] object-contain"
          />
        ) : (
          <span className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent text-white text-sm font-bold flex items-center justify-center">
            {initials}
          </span>
        )}
        <div>
          <p className="text-sm font-bold text-zinc-900 whitespace-nowrap">{partner.name}</p>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">{partner.role}</p>
        </div>
      </div>
    </div>
  );
}

export function PartnersMarquee() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden"
    >
      <div className="flex [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex shrink-0 items-center animate-marquee py-2">
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <PartnerLogo key={i} partner={p} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
