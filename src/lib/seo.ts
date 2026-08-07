// ---- Central SEO / AEO configuration & helpers -----------------------------
// Single source of truth for the production URL. Change it in one place and
// canonical, sitemap, robots and Open Graph URLs all follow.

export const SITE_URL = "https://srishreevisionfoundation.org";

export const SITE = {
  name: "Srishree Vision Foundation",
  legalName: "SRISHREE VISION FOUNDATION",
  tagline: "Local Vision, Global Impact",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.jpeg`,
  phone: "+918977910974",
  phoneAlt: "+919701100974",
  email: "srishreevisionfoundation1@gmail.com",
  address: {
    streetAddress: "1-22, Golnaka Alwal, Alwal",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500010",
    addressCountry: "IN",
  },
  registrationNo: "20967/6",
  operatingAreas: ["Telangana", "Hyderabad", "Khagaznagar", "Dahegam"],
  keywords: [
    "NGO in Telangana",
    "charity in Hyderabad",
    "non-profit organization",
    "free eye camp",
    "health camps",
    "women empowerment",
    "education skill development",
    "blood donation camp",
    "rural development India",
    "CSR partner NGO India",
    "donate to charity India",
    "volunteer NGO Hyderabad",
  ],
};

export const SITE_DESCRIPTION =
  "Srishree Vision Foundation (Reg. 20967/6) is a registered non-profit NGO in Hyderabad, Telangana running free health & eye camps, blood donation drives, women empowerment, education and community development programs. Volunteer, donate, or partner with us.";

export interface SeoPage {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  image?: string;
  jsonLd?: object[];
}

// Meta-tag helpers

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(list: object[]) {
  document.head
    .querySelectorAll<HTMLScriptElement>("script[data-seo-jsonld]")
    .forEach((s) => s.remove());
  list.forEach((obj) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seoJsonld = "1";
    script.textContent = JSON.stringify(obj);
    document.head.appendChild(script);
  });
}

// Base structured data injected on every public page (AEO)

const rootJsonLd: object[] = [
  {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: SITE.logo,
    image: SITE.logo,
    slogan: SITE.tagline,
    description: SITE_DESCRIPTION,
    email: SITE.email,
    telephone: "+91 8977910974",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.addressCountry,
    },
    areaServed: SITE.operatingAreas,
    foundingDate: "2025",
    knowsAbout: [
      "Eyecare and eye camps",
      "Healthcare camps",
      "Women empowerment",
      "Education and skill development",
      "Community and rural development",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.legalName,
    url: SITE.url,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/news?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
];

// Answer Engine Optimization (AEO) content.
// These Q&A pairs are emitted as FAQPage JSON-LD AND mirrored as visible
// sections so AI search and answer engines can cite them.

interface Faq {
  q: string;
  a: string;
}

const HOME_FAQS: Faq[] = [
  {
    q: "What does Srishree Vision Foundation do?",
    a: "Srishree Vision Foundation is a registered non-profit NGO in Hyderabad, Telangana that runs free health and eye camps, blood donation drives, women empowerment, education and community development programs for underprivileged communities.",
  },
  {
    q: "Is Srishree Vision Foundation a registered NGO?",
    a: "Yes. Srishree Vision Foundation is a registered non-profit organization (Registration No. 20967/6) working across Telangana.",
  },
  {
    q: "How can I contribute to Srishree Vision Foundation?",
    a: "You can apply through the / apply page to volunteer, intern, fundraise or partner as a CSR organization, or donate directly to fund health camps and community programs across Telangana.",
  },
  {
    q: "Can corporates partner with the foundation for CSR?",
    a: "Yes. Corporates own health, eye care, education and skill-development programs. Submit the partnership form or email srishreevisionfoundation1@gmail.com.",
  },
  {
    q: "Where is Srishree Vision Foundation located?",
    a: "The foundation is based at 1-22, Golnaka Alwal, Alwal, Hyderabad, Telangana - 500010, India, and operates programs across Telangana.",
  },
];

const SERVICES_FAQS: Faq[] = [
  {
    q: "Does the foundation conduct free eye camps?",
    a: "Yes. Srishree Vision Foundation runs free eye check-up camps with screening and distribution of free spectacles, often in partnership with iCare Vision Center and Lions Club.",
  },
  {
    q: "What health programs does the NGO run?",
    a: "Free eye camps, blood donation drives, sugar/BP/hemoglobin health screening, polio awareness and public health-prevention campaigns across Telangana.",
  },
  {
    q: "Do you run women empowerment programs?",
    a: "Yes. We run confidence-building, skill-training and self-reliance programs that help women achieve financial independence and dignity.",
  },
  {
    q: "How can my organization partner with Srishree Vision Foundation?",
    a: "We collaborate with Lions Clubs, iCare Vision Center, Telangana Police, TGNAB and other bodies. Use the Apply page to propose a partnership.",
  },
];

function faqJsonLd(faqs: Faq[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// Route -> SEO configuration.
// Keys may be exact paths; longer keys are matched first so "/news" never
// swallows "/news/:id". A key also matches its sub-paths.
const ROUTE_SEO: Record<string, SeoPage> = {
  "/": {
    title: "Srishree Vision Foundation | Local Vision, Global Impact",
    description: SITE_DESCRIPTION,
    keywords: SITE.keywords,
    image: SITE.logo,
    jsonLd: [faqJsonLd(HOME_FAQS)],
  },
  "/about": {
    title: "About Us | Mission, Vision and Impact | Srishree",
    description:
      "Learn about Srishree Vision Foundation's mission to empower communities through free health camps, eye care, education and women empowerment across Telangana.",
    keywords: ["about NGO Telangana", "community health NGO", "youth welfare"],
  },
  "/services": {
    title: "Our Programs & Services | Health, Education and Empowerment",
    description:
      "Explore our free eye camps, blood donation drives, health screening, women empowerment, education and rural development programs across Telangana.",
    keywords: ["NGO programs India", "health and eye care camps", "women empowerment initiatives", "education programs NGO"],
    jsonLd: [
      faqJsonLd(SERVICES_FAQS),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Community Development Programs",
        serviceType: "NGO Welfare and Development",
        provider: { "@type": "NGO", name: SITE.legalName, url: SITE.url },
        areaServed: SITE.operatingAreas,
        description:
          "Free health and eye camps, blood donation drives, women empowerment, education, skill development and rural development programs in Telangana.",
      },
    ],
  },
  "/events": {
    title: "Events and Medical Camps | Srishree Vision Foundation",
    description:
      "Join our upcoming health camps, blood donation drives, drug-awareness programs and the Annual Green Earth Drive in Telangana.",
    keywords: ["NGO events Telangana", "medical camps Hyderabad", "community outreach"],
  },
  "/news": {
    title: "News and Updates | Srishree Vision Foundation",
    description: "Latest partner updates and impact stories from Srishree Vision Foundation.",
    keywords: ["NGO news India", "Srishree Vision updates"],
  },
  "/gallery": {
    title: "Gallery | Photos of Our Work | Srishree Vision Foundation",
    description:
      "Browse photos from our eye camps, health drives, women empowerment workshops and community outreach across Telangana.",
    keywords: ["NGO photo gallery", "community outreach images"],
  },
  "/contact": {
    title: "Contact Us | Srishree Vision Foundation",
    description:
      "Contact Srishree Vision Foundation by phone, email or WhatsApp. Located in Hyderabad, Telangana - 500010.",
    keywords: ["contact NGO Hyderabad", "partnership NGO Telangana"],
  },
  "/apply": {
    title: "Apply to Volunteer, Intern, Partner or Fundraise | Srishree",
    description:
      "Join Srishree Vision Foundation as a volunteer, intern, CSR partner or fund-raiser and help build self-reliant communities.",
    keywords: ["volunteer NGO Hyderabad", "CSR partner NGO India"],
  },
  "/donate": {
    title: "Donate and Support | Srishree Vision Foundation",
    description:
      "Donate to Srishree Vision Foundation to fund free health camps, eye care and women empowerment programs across Telangana.",
    keywords: ["donate NGO India", "charity Telangana", "give to charity"],
  },
  "/legal": {
    title: "Legal and Certifications | 80G, 12A and FCRA | Srishree",
    description:
      "Legal, tax exemption and compliance details (80G, 12A, FCRA, grievance) for Srishree Vision Foundation.",
    keywords: ["NGO 80G certification", "FCRA NGO India"],
  },
  "/nasha-mukt-pledge": {
    title: "Nasha Mukt Abhiyaan - Drug-Free Youth Pledge | Srishree",
    description:
      "Take the Nasha Mukt pledge for a drug-free youth and download your free certificate. An anti-drug awareness campaign by Srishree Vision Foundation.",
    keywords: ["drug free India pledge", "Nasha Mukt pledge", "anti drug NGO"],
  },
  "/netra-suraksha-pledge": {
    title: "Netra Suraksha - Eye Care and Eye Donation Pledge | Srishree",
    description:
      "Take the Netra Suraksha pledge and pledge to donate your eyes. Join our sight-saving mission against avoidable blindness.",
    keywords: ["eye pledge India", "eye donation NGO", "Netra Suraksha"],
  },
  "/vision-warrior": {
    title: "Vision Warrior - Community Pledge | Srishree Vision Foundation",
    description:
      "Become a Vision Warrior for vision health. Take the pledge, earn a certificate and support eye care in Telangana.",
  },
  "/volunteer-certificate": {
    title: "Volunteer Certificate | Srishree Vision Foundation",
    description:
      "Generate your volunteer certificate after contributing to Srishree Vision Foundation events.",
  },
  "/verify-certificate": {
    title: "Verify Certificate | Srishree Vision Foundation",
    description:
      "Authenticate your pledge or volunteer certificate issued by Srishree Vision Foundation.",
  },
};

const ORDERED_KEYS = Object.keys(ROUTE_SEO).sort((a, b) => b.length - a.length);

function resolvePage(pathname: string): SeoPage | null {
  if (pathname === "/") return ROUTE_SEO["/"];

  // /news/:id -> article-style page using the parent News config.
  if (/^\/news\/[^/]+$/.test(pathname)) {
    return {
      ...ROUTE_SEO["/news"],
      title: `${ROUTE_SEO["/news"].title} | Update`,
    };
  }

  for (const key of ORDERED_KEYS) {
    if (key === "/") continue;
    if (pathname === key || pathname.startsWith(key + "/")) {
      return ROUTE_SEO[key];
    }
  }
  return null;
}

export const DEFAULT_PAGE: SeoPage = {
  title: `${SITE.legalName} | Local Vision, Global Impact`,
  description: SITE_DESCRIPTION,
  keywords: SITE.keywords,
};

export function applySeo(pathname: string) {
  const page: SeoPage = resolvePage(pathname) ?? DEFAULT_PAGE;
  const canonical = page.canonical ?? `${SITE_URL}${pathname === "/" ? "/" : pathname}`;

  upsertJsonLd([...rootJsonLd, ...(page.jsonLd ?? [])]);

  document.title = page.title;
  upsertMeta("name", "description", page.description);
  upsertMeta("name", "keywords", page.keywords.join(", "));
  upsertMeta("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large");
  upsertMeta("name", "author", SITE.legalName);
  upsertMeta("name", "theme-color", "#0F6E6E");

  upsertLink("canonical", canonical);

  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:title", page.title);
  upsertMeta("property", "og:description", page.description);
  upsertMeta("property", "og:url", canonical);
  upsertMeta("property", "og:site_name", SITE.legalName);
  upsertMeta("property", "og:image", page.image ?? SITE.logo);
  upsertMeta("property", "og:locale", "en_IN");

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", page.title);
  upsertMeta("name", "twitter:description", page.description);
  upsertMeta("name", "twitter:image", page.image ?? SITE.logo);
}