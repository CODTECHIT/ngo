import { useState } from "react";
import { motion } from "motion/react";

export const PARTNERS = [
  { name: "Hope Foundation", role: "Partner", logo: "https://hope-foundation.in/wp-content/uploads/2023/08/hope-web.png" },
  { name: "Akshaya Pathra Foundation", role: "Partner", logo: "https://upload.wikimedia.org/wikipedia/en/e/e1/The_Akshaya_Patra_Foundation_Logo.png" },
  { name: "India Vision Foundation", role: "Partner", logo: "https://indiavisionfoundation.org/wp-content/uploads/2022/06/ivf_logo_new-2048x1031.png" },
  { name: "Smile Foundation", role: "Partner", logo: "https://www.smilefoundationindia.org/wp-content/uploads/2024/07/SMILE-FOUNDATION-LOGO-e1662456150120-1.png" },
  { name: "Telangana Government", role: "Partner", logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Emblem_of_Telangana.svg" },
  { name: "Azad Foundation", role: "Partner", logo: "https://www.azadfoundation.com/wp-content/uploads/2024/06/azad-foundation-logo.svg" },
  { name: "Swarsh Foundation", role: "Partner", logo: "https://cdn.sanity.io/images/gowsc29l/production/161b4e2fb434e3b554ed0c8474ee6a284a69261e-320x200.svg" },
  { name: "JK Foundation", role: "Partner", logo: "https://speedy.uenicdn.com/3d1eac12-6e2a-42ed-a142-b6a0e3b15ff4/n400_240a/image/upload/v1586524772/business/adcc1b3ca530423e96f84d29e8948fbb.jpg" },
  { name: "Youth Skill Development Foundation", role: "Partner", logo: "https://ysdf.in/storage/2020/07/cropped-logo-main.png" },
  { name: "NSDC", role: "Partner", logo: "https://upload.wikimedia.org/wikipedia/commons/d/dd/NSDC_Logo.svg" },
  { name: "SCCL", role: "Partner", logo: "https://www.scclmines.com/images/logo.jpg" },
  { name: "Ashraya foundation", role: "Partner", logo: "https://ashrayawelfarefoundation.org/assets/img/ashrayas.png" },
  { name: "NEST Foundation", role: "Partner", logo: "https://nestfoundations.org/images/logo.png" },
  { name: "Skill India", role: "Partner", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Skill_India_Logo.jpg" },
  { name: "Basic Foundation", role: "Partner", logo: "https://www.basicfoundation.org/assets/img/logo/logo.png" },
  { name: "iCare Vision Center", role: "Eye Care Partner", logo: "" },
  { name: "Lions Clubs International", role: "Community Partner", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Lions_Clubs_International_logo.svg/330px-Lions_Clubs_International_logo.svg.png" },
  { name: "Telangana Police", role: "Public Safety Partner", logo: "https://upload.wikimedia.org/wikipedia/en/0/01/Telangana_Police_Logo.png" },
  { name: "TGNAB", role: "Awareness Partner", logo: "https://www.deccanchronicle.com/h-upload/2024/11/29/1867886-drugs.webp" },
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
    <div className="shrink-0">
      <div className="flex items-center gap-3 bg-white border border-black/10 rounded-2xl px-3 md:px-5 py-4 hover:border-primary/40 hover:shadow-[0_0_25px_rgba(15,110,110,0.1)] transition-all">
        {partner.logo && !failed ? (
          <img
            src={partner.logo}
            alt={partner.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-8 md:h-10 w-auto max-w-[70px] md:max-w-[100px] object-contain"
          />
        ) : (
          <span className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent text-white text-sm font-bold flex items-center justify-center">
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-xs md:text-sm font-bold text-zinc-900 truncate">{partner.name}</p>
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-zinc-500 font-medium truncate">{partner.role}</p>
        </div>
      </div>
    </div>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function PartnersMarquee() {
  const columns = chunk(PARTNERS, Math.ceil(PARTNERS.length / 3));
  const directions: ("up" | "down")[] = ["up", "down", "up"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden"
    >
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        {columns.map((col, i) => (
          <div
            key={i}
            className="relative overflow-hidden h-[300px] md:h-[340px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
          >
            <div
              className={`flex flex-col gap-3 md:gap-4 py-2 ${directions[i] === "up" ? "animate-marquee-up" : "animate-marquee-down"
                }`}
            >
              {[...col, ...col].map((p, j) => (
                <PartnerLogo key={j} partner={p} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
