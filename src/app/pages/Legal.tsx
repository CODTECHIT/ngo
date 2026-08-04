import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import { motion } from "motion/react";
import { ShieldCheck, ScrollText, Scale, Mail, Phone, MapPin, Clock, CheckCircle2, Send, FileText } from "lucide-react";
import { SectionLabel } from "../components/Layout";
import Aurora from "../components/reactbits/Aurora";

const NGO = {
  name: "SRISHREE VISION FOUNDATION",
  tagline: "Local Vision, Global Impact",
  regNo: "20967/6, Dated 14/01/2026",
  cin: "U85500TS2026NPL209676",
  pan: "ABSCS4201R",
  tan: "HYDS90801E",
  address: "1-11-22, Golnaka Alwal, Tirumalagiri, Hyderabad, Telangana - 500010",
  phone: "+91 89779 10974",
  phone2: "+91 97011 00974",
  email: "srishreevisionfoundation1@gmail.com",
  hours: "Monday - Saturday: 9:00 AM - 6:00 PM",
  updated: "August 2, 2026",
};

const TAB_ORDER = ["privacy", "terms", "grievance"] as const;
type TabId = (typeof TAB_ORDER)[number];

const TABS: { id: TabId; label: string; icon: React.ElementType; intro: string }[] = [
  {
    id: "privacy",
    label: "Privacy Policy",
    icon: ShieldCheck,
    intro: "How SRISHREE VISION FOUNDATION collects, uses, protects and manages the personal information of visitors, donors, volunteers and beneficiaries.",
  },
  {
    id: "terms",
    label: "Terms of Use",
    icon: ScrollText,
    intro: "The terms and conditions that govern your use of the SRISHREE VISION FOUNDATION website and the services we offer.",
  },
  {
    id: "grievance",
    label: "Grievance Redressal",
    icon: Scale,
    intro: "Our commitment to resolving complaints and grievances raised by donors, volunteers, beneficiaries and the general public in a fair and timely manner.",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function Block({ heading, body, list }: { heading: string; body?: string[]; list?: string[] }) {
  return (
    <div>
      <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0" />
        {heading}
      </h3>
      {body?.map((p, i) => (
        <p key={i} className="text-zinc-600 font-light leading-relaxed mb-4 text-[15px] md:text-base">
          {p}
        </p>
      ))}
      {list && (
        <ul className="space-y-3 mb-4">
          {list.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-zinc-600 font-light text-[15px] md:text-base leading-relaxed">
              <CheckCircle2 size={18} className="text-accent shrink-0 mt-1" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const PRIVACY_CONTENT = {
  intro:
    "At SRISHREE VISION FOUNDATION, we are committed to protecting the privacy and dignity of the people we serve and those who support us. This Privacy Policy explains what personal information we collect, why we collect it and how we handle it, in accordance with the Information Technology Act, 2000 and applicable data protection laws in India.",
  blocks: [
    {
      heading: "Information We Collect",
      body: [
        "We collect only the information necessary to run our programmes and provide our services. This may include:",
      ],
      list: [
        "Personal details you provide voluntarily   name, email address, phone number and postal address (e.g., when you contact us, register for an event, or subscribe to updates).",
        "Donation records   name, payment details processed through secure payment gateways and the amount and purpose of your contribution. We never store full card or bank details on our own systems.",
        "Beneficiary information   information shared with us during health camps, education programmes and welfare initiatives to the extent required for delivering those services.",
        "Volunteer information   skills, availability and emergency contact details of volunteers who register with us.",
        "Technical data   your IP address, browser type and pages visited when you browse our website, collected through analytics tools and cookies.",
      ],
    },
    {
      heading: "How We Use Your Information",
      body: ["The information we collect is used strictly for purposes connected with our work:"],
      list: [
        "To respond to your enquiries and communicate with you about our programmes, events and initiatives.",
        "To process donations, issue receipts (including 80G tax exemption certificates) and maintain donor records.",
        "To register participants and volunteers for our events and camps.",
        "To improve our website, services and outreach based on aggregate usage patterns.",
        "To comply with legal, regulatory and audit obligations of a registered non-profit organisation.",
      ],
    },
    {
      heading: "Cookies and Tracking",
      body: [
        "Our website may use cookies and similar technologies to improve your browsing experience and understand how the site is used. Cookies are small text files stored on your device. You may disable cookies through your browser settings, though some features of the website may not function properly as a result.",
      ],
    },
    {
      heading: "How We Share Your Information",
      body: [
        "We do not sell, rent or trade your personal information. We share information only in the following limited circumstances:",
      ],
      list: [
        "With our trusted partners (e.g., iCare Vision Center, Lions Club of International, Telangana Police and other bodies we collaborate with) only where necessary to deliver a programme you have opted into.",
        "With service providers such as payment gateways and hosting providers, who are bound by confidentiality and data security obligations.",
        "When required by law, court order, or government authority, or to protect the safety and legal rights of the Foundation, our staff, volunteers or the public.",
      ],
    },
    {
      heading: "Data Security",
      body: [
        "We take reasonable technical and organisational measures to protect your personal information from unauthorised access, loss, misuse or alteration. These include secure transmission of payment data through certified payment gateways, restricted access to donor and beneficiary records and regular review of our security practices.",
      ],
    },
    {
      heading: "Data Retention",
      body: [
        "We retain personal information only for as long as necessary to fulfil the purposes described in this policy, comply with legal and audit requirements (including 80G donation record-keeping rules), or until you request its deletion, subject to applicable law.",
      ],
    },
    {
      heading: "Your Rights",
      body: [
        "You have the right to access, correct, update or request deletion of the personal information we hold about you. You may also withdraw any consent you have given to us at any time. To exercise these rights, please contact our Grievance Officer using the details provided in the Grievance Redressal section of this page.",
      ],
    },
    {
      heading: "Children's Privacy",
      body: [
        "We do not knowingly collect personal information from children under 18 without the consent of a parent or legal guardian. Information about children participating in our education and health programmes is collected only with guardian consent and used solely for programme delivery.",
      ],
    },
    {
      heading: "Third-Party Links",
      body: [
        "Our website may contain links to third-party websites (such as payment portals and partner organisations). We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies before providing any information.",
      ],
    },
    {
      heading: "Changes to This Privacy Policy",
      body: [
        `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The latest version will always be available on this page, with the date of the most recent revision. Significant changes will be communicated through the website.`,
      ],
    },
    {
      heading: "Contact Us",
      body: [
        "If you have any questions or concerns about this Privacy Policy or how your information is handled, please write to our Grievance Officer at the address provided in the Grievance Redressal section, or email us at " + NGO.email + ".",
      ],
    },
  ],
};

const TERMS_CONTENT = {
  intro:
    "These Terms of Use govern your access to and use of the website of SRISHREE VISION FOUNDATION. By accessing or using this website, you agree to be bound by these terms. If you do not agree with any part of these terms, please do not use the website.",
  blocks: [
    {
      heading: "About SRISHREE VISION FOUNDATION",
      body: [
        "SRISHREE VISION FOUNDATION is a registered non-profit organisation working in healthcare, eye care, education, skill development, women empowerment and community development across Telangana. Our registration details are as follows:",
      ],
      list: [
        "Registration No: " + NGO.regNo,
        "CIN No: " + NGO.cin,
        "PAN: " + NGO.pan,
        "TAN: " + NGO.tan,
        "Registered Address: " + NGO.address,
      ],
    },
    {
      heading: "Use of the Website",
      body: [
        "You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use of this website by, any third party. You must not attempt to gain unauthorised access to any part of the website, its servers or connected systems.",
      ],
    },
    {
      heading: "Donations and Payments",
      body: [
        "Donations made through this website are voluntary contributions to SRISHREE VISION FOUNDATION. All payment transactions are processed through secure third-party payment gateways. Please retain the transaction reference for your records, as donation receipts (including 80G certificates where applicable) are issued based on verifiable payment details. Donations, once made, are not refundable except in cases of erroneous or duplicate transactions, which will be reviewed by our team.",
      ],
    },
    {
      heading: "Event Registrations",
      body: [
        "Registrations for our events, camps and programmes are subject to availability and any conditions specified for the particular event. By registering, you consent to receiving programme-related communications and to being photographed or recorded for documentation purposes unless you inform us otherwise in writing.",
      ],
    },
    {
      heading: "Intellectual Property",
      body: [
        "All content on this website, including text, graphics, logos, images and software, is the property of SRISHREE VISION FOUNDATION or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute or create derivative works from any content on this website without prior written permission from the Foundation.",
      ],
    },
    {
      heading: "Third-Party Links",
      body: [
        "This website may contain links to external websites operated by our partners or service providers. We are not responsible for the content or practices of these websites and links are provided for your convenience only.",
      ],
    },
    {
      heading: "Disclaimer of Warranties",
      body: [
        "This website and its content are provided on an \"as is\" and \"as available\" basis without warranties of any kind, whether express or implied, including accuracy, completeness or fitness for a particular purpose. While we endeavour to keep the information on this website up to date, we do not guarantee that it is free from errors.",
      ],
    },
    {
      heading: "Limitation of Liability",
      body: [
        "To the maximum extent permitted by law, SRISHREE VISION FOUNDATION, its trustees, officers, employees and volunteers shall not be liable for any direct, indirect, incidental or consequential damages arising out of your use of, or inability to use, this website or the information contained in it.",
      ],
    },
    {
      heading: "Indemnification",
      body: [
        "You agree to indemnify and hold harmless SRISHREE VISION FOUNDATION and its trustees, officers, employees and volunteers from any claims, losses, liabilities or expenses arising out of your use of this website or your violation of these Terms of Use.",
      ],
    },
    {
      heading: "Governing Law and Jurisdiction",
      body: [
        "These Terms of Use are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts at Hyderabad, Telangana.",
      ],
    },
    {
      heading: "Changes to These Terms",
      body: [
        "We may revise these Terms of Use at any time by updating this page. Your continued use of the website after such changes constitutes acceptance of the revised terms.",
      ],
    },
    {
      heading: "Contact Us",
      body: [
        "For any questions regarding these Terms of Use, please contact us at " + NGO.email + " or " + NGO.phone + ".",
      ],
    },
  ],
};

const GRIEVANCE_CONTENT = {
  intro:
    "SRISHREE VISION FOUNDATION is committed to maintaining the highest standards of transparency, accountability and ethical conduct. This Grievance Redressal Policy provides a clear and accessible mechanism for any person   beneficiary, donor, volunteer, partner or member of the public   to raise a concern or complaint and have it addressed fairly and promptly.",
  blocks: [
    {
      heading: "Who Can Raise a Grievance",
      body: [
        "Any individual or organisation that interacts with the Foundation   including beneficiaries of our programmes, donors, volunteers, staff, partner organisations and the general public   may raise a grievance regarding our services, conduct, or compliance with our policies and commitments.",
      ],
    },
    {
      heading: "What Constitutes a Grievance",
      body: ["Common types of grievances include:"],
      list: [
        "Concerns about the quality, delivery or outcome of our programmes and services.",
        "Complaints regarding the conduct of staff, volunteers or representatives of the Foundation.",
        "Issues related to donations, receipts (including 80G certificates) or event registrations.",
        "Allegations of misuse of funds, misrepresentation or non-compliance with applicable laws.",
        "Privacy concerns or requests to access, correct or delete personal information.",
        "Safeguarding concerns regarding any individual associated with the Foundation.",
      ],
    },
    {
      heading: "Grievance Redressal Officer",
      body: [
        "The Board of SRISHREE VISION FOUNDATION has designated a Grievance Redressal Officer who is responsible for receiving, investigating and resolving all grievances in a fair, confidential and timely manner.",
        "Grievance Redressal Officer: Director, SRISHREE VISION FOUNDATION",
      ],
      list: [
        "Email: " + NGO.email,
        "Phone: " + NGO.phone + " / " + NGO.phone2,
        "Address: " + NGO.address,
      ],
    },
    {
      heading: "How to Raise a Grievance",
      body: [
        "You may raise a grievance through any of the following channels. Please provide your name, contact details, a clear description of the issue and any supporting information or documents.",
      ],
      list: [
        "By email to " + NGO.email + " with the subject line \"Grievance\".",
        "By phone at " + NGO.phone + " during working hours (" + NGO.hours + ").",
        "In writing or in person at our registered address: " + NGO.address + ".",
        "Through the 'Contact Us' page of this website, mentioning the nature of your grievance.",
      ],
    },
    {
      heading: "Redressal Process and Timeline",
      body: [
        "All grievances are handled through the following process:",
      ],
      list: [
        "Acknowledgement   you will receive an acknowledgement of your grievance within 3 working days.",
        "Review   the Grievance Redressal Officer will investigate the matter, gathering relevant facts and consulting concerned parties as needed.",
        "Resolution   we aim to resolve grievances within 21 working days of acknowledgement. Where a grievance requires more time, you will be informed of the reason and the expected timeline.",
        "Communication   the outcome of the review, along with any remedial action taken, will be communicated to you through the channel you used to raise the grievance.",
      ],
    },
    {
      heading: "Escalation",
      body: [
        "If you are not satisfied with the resolution provided, you may escalate your grievance in writing to the Board of Trustees of SRISHREE VISION FOUNDATION at the registered address or by email to " + NGO.email + ", within 15 days of receiving the resolution. The Board will review the matter and provide a final response within 30 days.",
      ],
    },
    {
      heading: "Confidentiality and Non-Retaliation",
      body: [
        "All grievances are treated with strict confidentiality. Information is shared only with those involved in the investigation on a need-to-know basis. The Foundation follows a strict non-retaliation policy   no person will be penalised or discriminated against for raising a grievance in good faith.",
      ],
    },
    {
      heading: "Records and Reporting",
      body: [
        "All grievances and their outcomes are recorded and reviewed periodically by the Board of Trustees to identify recurring issues and improve our policies, programmes and governance.",
      ],
    },
  ],
};

function ContactCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-black/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
      <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-8 tracking-tight relative z-10">Reach Our Office</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
        {[
          { icon: Mail, title: "Email", lines: [NGO.email] },
          { icon: Phone, title: "Phone", lines: [NGO.phone, NGO.phone2] },
          { icon: MapPin, title: "Registered Address", lines: [NGO.address] },
          { icon: Clock, title: "Working Hours", lines: [NGO.hours, "Sunday: Closed"] },
        ].map((item, i) => (
          <motion.div variants={fadeIn} key={item.title} className="bg-black/5 border border-black/5 rounded-2xl p-5 hover:border-black/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center mb-3">
              <item.icon size={20} className="text-primary" />
            </div>
            <h4 className="font-bold text-zinc-900 text-sm mb-1">{item.title}</h4>
            {item.lines.map((line, j) => (
              <p key={j} className="text-xs md:text-sm text-zinc-600 font-light break-words">{line}</p>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Legal() {
  const location = useLocation();
  const [active, setActive] = useState<TabId>("privacy");

  const validTab = (hash: string): TabId =>
    (TAB_ORDER as readonly string[]).includes(hash) ? (hash as TabId) : "privacy";

  useEffect(() => {
    setActive(validTab(window.location.hash.replace("#", "")));
  }, [location]);

  const handleTabChange = (id: string) => {
    setActive(id as TabId);
    window.history.replaceState(null, "", `#${id}`);
  };

  const content = { privacy: PRIVACY_CONTENT, terms: TERMS_CONTENT, grievance: GRIEVANCE_CONTENT }[active];
  const tabMeta = TABS.find((t) => t.id === active)!;

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-10 md:pt-28 md:pb-14 px-4 md:px-6 relative overflow-hidden flex flex-col items-center justify-center md:min-h-[45vh]">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-multiply">
          <Aurora colorStops={["#0F6E6E", "#29B6F6", "#4CAF50"]} amplitude={1.2} />
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-multiply z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center">
            <SectionLabel>Legal &amp; Compliance</SectionLabel>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-zinc-900 mb-6 tracking-tight leading-tight uppercase"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Legal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Policies</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-600 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            The policies that govern how {NGO.name} collects information, how you may use our website and how we address
            complaints   all built on transparency, trust and accountability.
          </motion.p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white border border-black/10 rounded-3xl p-2 md:p-3 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-2">
            {TABS.map((tab) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative rounded-2xl px-5 py-4 md:py-5 text-left transition-all ${isActive ? "text-white" : "text-zinc-700 hover:bg-black/5"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="legal-tab-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl shadow-[0_0_25px_rgba(15,110,110,0.35)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <tab.icon size={22} className={isActive ? "text-white" : "text-primary"} />
                    <div>
                      <p className="font-bold text-sm md:text-base">{tab.label}</p>
                      <p className={`text-[10px] uppercase tracking-widest font-bold ${isActive ? "text-white/80" : "text-zinc-400"}`}>
                        {tab.id === "privacy" ? "Data & Trust" : tab.id === "terms" ? "Website Rules" : "Fair Redressal"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-black/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center shrink-0">
                <tabMeta.icon size={26} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {tabMeta.label}
                </h2>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mt-1">
                  {NGO.name} · Last updated {NGO.updated}
                </p>
              </div>
            </div>

            <p className="text-zinc-600 font-light leading-relaxed mb-8 text-[15px] md:text-base border-l-4 border-primary/30 pl-5">
              {content.intro}
            </p>

            <div className="space-y-8">
              {content.blocks.map((block, i) => (
                <Block key={i} {...block} />
              ))}
            </div>
          </motion.div>

          <div className="mt-12">
            <ContactCard />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-zinc-500 font-light text-sm mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
              Have a question that is not answered here? We are happy to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(15,110,110,0.2)] text-sm">
                Contact Us <Send size={15} />
              </Link>
              <Link to="/donate" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-black/20 text-zinc-900 font-bold rounded-full hover:bg-black/5 transition-all text-sm">
                <FileText size={15} className="text-primary" /> Support Our Cause
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
