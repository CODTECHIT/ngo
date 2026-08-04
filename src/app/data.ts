export const EVENTS = [
  {
    id: 1, status: "completed", category: "Health",
    title: "Free Eye Check-up Camp",
    date: "December 2025", venue: "Dahegam, Telangana",
    desc: "150+ people screened, 45 identified for free spectacles, in partnership with iCare Vision Center.",
    banner: "/events/eye-camp.jpg",
    seats: 0, deadline: "Completed",
  },
  {
    id: 2, status: "completed", category: "Health",
    title: "Blood Donation & Health Check Camp",
    date: "June 14, 2026", venue: "Agrasen Bhavan, near Krishna Rao Hospital",
    desc: "Free blood donation camp with sugar, BP and hemoglobin testing, in partnership with Hindu Jagarana Mancha and iCare Vision Center.",
    banner: "/events/blood-donation.jpg",
    seats: 0, deadline: "Completed",
  },
  {
    id: 3, status: "upcoming", category: "Community",
    title: "Drug Awareness Program",
    date: "June 26, 2026", venue: "Opp. Fine Hotel, Ambedkar Chowk, Khagaznagar",
    desc: "Awareness drive in partnership with Telangana Police, TGNAB and Lions Club of International.",
    banner: "/events/drug-awareness.jpg",
    seats: 100, deadline: "June 25, 2026",
  },
  {
    id: 4, status: "upcoming", category: "Environment",
    title: "Annual Green Earth Drive 2026",
    date: "August 12, 2026", venue: "Central Park, Khagaznagar",
    desc: "Join 500+ volunteers for our largest tree plantation event. Refreshments provided for all participants. Certificate of participation issued.",
    banner: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&h=400&fit=crop&auto=format",
    seats: 120, deadline: "August 5, 2026",
  }
];

export const SERVICES = [
  { slug: "health-eye-care", icon: "Heart", title: "Health & Eye Care Camps", img: "https://archive.cehjournal.org/wp-content/uploads/2013/04/5591589853_b254109a50_o.jpg", color: "bg-teal-50", textColor: "text-teal-700", desc: "Free eye check-up camps, spectacle distribution and blood donation drives.", details: "Free eye check-up camps, spectacle distribution, blood donation drives and general health screening (sugar, BP, hemoglobin) camps conducted in partnership with local hospitals, Lions Club and police." },
  { slug: "education-skill", icon: "BookOpen", title: "Education & Skill Development", img: "https://srdsindia.org/wp-content/uploads/2021/09/teaching.jpeg", color: "bg-sky-50", textColor: "text-sky-700", desc: "Programs aimed at building awareness and skills among youth.", details: "Programs aimed at building awareness and skills among youth and farming communities, including safe agricultural practice awareness." },
  { slug: "women-empowerment", icon: "Users", title: "Women Empowerment", img: "https://images.deccanchronicle.com/dc-Cover-evutgf5c1ji9f3bioadrrd1q22-20170307231336.Medi.jpeg", color: "bg-orange-50", textColor: "text-orange-700", desc: "Initiatives supporting women's confidence and self-sufficiency.", details: "Initiatives supporting women's confidence, participation and self-Sustainabilitywithin local communities." },
  { slug: "community-rural", icon: "Globe", title: "Community & Rural Development", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrcFs-CJGepmn6IPdXItKuRt3EYDhm26uOQSb4Dnxt8awYzyYB_zzxtQyB&s=10", color: "bg-teal-50", textColor: "text-teal-700", desc: "Outreach programs including drug awareness and rural health initiatives.", details: "Outreach programs including drug awareness, polio vaccination awareness and rural health initiatives, run in partnership with Telangana Police, TGNAB and Lions Club." },
  { slug: "public-health", icon: "Shield", title: "Public Health Awareness", img: "https://nairshospital.in/wp-content/uploads/2022/11/IMG-20191015-WA0022-1-1024x768.jpg", color: "bg-sky-50", textColor: "text-sky-700", desc: "Campaigns on disease prevention and responsible practices.", details: "Campaigns on responsible pesticide/fertilizer use for farmers, drug-free youth campaigns and disease prevention (Pulse Polio)." },
  { slug: "partnerships-outreach", icon: "Handshake", title: "Partnerships & Community Outreach", img: "https://smartvillagemovement.org/wp-content/uploads/2024/03/21.png", color: "bg-orange-50", textColor: "text-orange-700", desc: "Working alongside partners to extend the reach of welfare programs.", details: "Working alongside Lions Club of International, iCare Vision Center, Hindu Jagarana Mancha and Telangana Police to extend the reach of health and welfare programs." },
];

export const NEWS = [
  {
    id: 1,
    date: "July 8, 2025",
    tag: "Campaign",
    title: "'Clean Ganga, Green India' Campaign Reaches 5,000 Households",
    excerpt: "Our month-long awareness campaign in the Gangetic plain region achieved unprecedented reach, partnering with 30 local panchayats across four districts.",
    content: `<p>Our month-long awareness campaign in the Gangetic plain region achieved unprecedented reach, partnering with 30 local panchayats across four districts to promote sustainable sanitation and eco-friendly waste management practices.</p><p>Over the course of the drive, volunteers distributed over 5,000 household waste segregation kits and conducted door-to-door education sessions on river conservation and plastic reduction. Local leaders praised the initiative for creating measurable civic awareness and fostering community-led environmental stewardship.</p><p>The foundation plans to expand this initiative to 50 additional villages in the coming quarters, ensuring long-term ecological sustainability and cleaner water resources for future generations.</p>`,
    img: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=380&fit=crop&auto=format"
  },
  {
    id: 2,
    date: "June 30, 2025",
    tag: "Recognition",
    title: "Organization Wins National NGO Excellence Award 2025",
    excerpt: "We are honored to receive this recognition for outstanding contribution to rural livelihood development and women empowerment programs across 9 states.",
    content: `<p>We are honored to receive this recognition for outstanding contribution to rural livelihood development and women empowerment programs across 9 states during the National NGO Excellence Awards 2025 held in New Delhi.</p><p>The award recognizes our community-first model, transparent financial practices, and measurable social impact in healthcare, vocational skill training, and digital literacy. Over 12,000 families have directly benefited from our targeted welfare schemes in the past financial year alone.</p><p>We dedicate this award to our dedicated team of field workers, grassroots volunteers, and generous supporters whose relentless commitment makes our mission possible every single day.</p>`,
    img: "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=600&h=380&fit=crop&auto=format"
  },
  {
    id: 3,
    date: "June 15, 2025",
    tag: "Partnership",
    title: "MoU Signed with State Education Department for Digital Literacy",
    excerpt: "A landmark agreement to deploy our Digital Skills Bootcamp across 120 government schools in three districts over the next 18 months.",
    content: `<p>A landmark agreement was signed today between SRISHREE VISION FOUNDATION and the State Education Department to deploy our flagship Digital Skills Bootcamp across 120 government schools in three districts over the next 18 months.</p><p>Under this Memorandum of Understanding (MoU), the foundation will equip computer labs with modern learning software, train government school teachers in digital pedagogy, and provide interactive coding and computer literacy modules to over 15,000 students in grades 6 through 10.</p><p>This partnership marks a significant milestone in bridging the digital divide for underprivileged youth in rural and semi-urban communities.</p>`,
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=380&fit=crop&auto=format"
  },
  {
    id: 4,
    date: "May 28, 2025",
    tag: "Impact",
    title: "12,400 Lives Impacted in FY 2024-25   Annual Report Released",
    excerpt: "Our annual impact report documents 12,400 direct beneficiaries, ₹4.8 Cr in program expenditure and a 94% program completion rate for the financial year.",
    content: `<p>Our annual impact report for Fiscal Year 2024-25 documents 12,400 direct beneficiaries, ₹4.8 Cr in program expenditure, and an outstanding 94% program completion rate across all active healthcare and education drives.</p><p>Key highlights from the report include 5,200 patients screened at free eye and medical check-up camps, 3,800 youth enrolled in skill development bootcamps, and 3,400 women supported through micro-entrepreneurship training programs.</p><p>The complete report with detailed financial audits and beneficiary testimonials is now available for download on our website.</p>`,
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=380&fit=crop&auto=format"
  },
  {
    id: 5,
    date: "May 10, 2025",
    tag: "Community",
    title: "50 Women Graduate from Entrepreneurship Bootcamp in Jaipur",
    excerpt: "The third cohort of our women's entrepreneurship bootcamp concludes with 50 graduates, 32 of whom have already launched micro-enterprises.",
    content: `<p>The third cohort of our women's entrepreneurship bootcamp concluded with a celebratory graduation ceremony for 50 women, 32 of whom have already launched micro-enterprises in tailoring, handicraft production, and food catering.</p><p>During the intensive 8-week bootcamp, participants received practical training in financial management, market linkage, digital payments, and business branding. Seed capital grants were also awarded to top-performing business proposals.</p><p>By empowering women to achieve financial independence, we strengthen entire families and build resilient local economies.</p>`,
    img: "https://images.unsplash.com/photo-1573164574397-dd250bc8a598?w=600&h=380&fit=crop&auto=format"
  },
  {
    id: 6,
    date: "April 22, 2025",
    tag: "Environment",
    title: "Earth Day 2025: 40,000 Saplings Planted Across 9 States",
    excerpt: "In our largest single-day plantation drive, 3,200 volunteers planted 40,000 saplings in coordinated events across all nine states of operation.",
    content: `<p>In our largest single-day plantation drive celebrating Earth Day 2025, over 3,200 volunteers planted 40,000 indigenous tree saplings in coordinated community events across nine states of operation.</p><p>The initiative brought together local schools, college youth clubs, municipal bodies, and corporate partners to restore degraded green spaces and promote biodiversity. Drip irrigation systems and community tree-guardian committees were established to ensure high sapling survival rates over the coming years.</p><p>Together, we are taking decisive action against climate change and nurturing a greener, healthier planet for generations to come.</p>`,
    img: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&h=380&fit=crop&auto=format"
  },
];

export const GALLERY_IMAGES = [
  { src: "/gallery/eye-camp.jpg", alt: "Free Eye Check-up Camp", tag: "Eye Care" },
  { src: "/gallery/blood-donation.jpg", alt: "Blood Donation Camp", tag: "Health" },
  { src: "/gallery/women-empowerment.jpg", alt: "Women Empowerment Workshop", tag: "Women Empowerment" },
  { src: "/gallery/community-outreach.jpg", alt: "Community Outreach", tag: "Community" },
  { src: "/gallery/polio-awareness.jpg", alt: "Polio Awareness Drive", tag: "Awareness Programs" },
  { src: "/gallery/drug-awareness-banner.jpg", alt: "Drug Awareness Program Banner", tag: "Awareness Programs" },
  { src: "/gallery/event-photo.jpg", alt: "Foundation Event", tag: "Events" },
];

export const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Beneficiary, Women Empowerment Program", quote: "The self-help group changed my life completely. I now run a small tailoring business and support my children's education independently.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=80&h=80&fit=crop&auto=format" },
  { name: "Rahul Mehta", role: "Volunteer, 3 Years", quote: "Working with this organization has given me purpose beyond my profession. The transparency, passion and community spirit here is unmatched.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" },
  { name: "Anita Desai", role: "Corporate Partner, TechCorp India", quote: "Our CSR partnership has been incredibly impactful. The team's execution is flawless and reporting is detailed   we renewed for a third year.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format" },
];

export const STATS = [
  {
    value: "11,000+",
    label: "Through our free vision camps & health initiatives",
  },
  {
    value: "2,500+",
    label: "Restoring vision through Recycle for Sight & community support",
  },
  {
    value: "310+",
    label: "Free eye screenings, awareness programs, and diagnostic drives",
  },
  {
    value: "1000+",
    label: "Healthcare, Education, Women & Community"
  },
];

export const ADMIN_EVENTS = [
  { id: 1, title: "Annual Green Earth Drive 2025", date: "Aug 12, 2025", registrations: 78, capacity: 120, status: "upcoming" },
  { id: 2, title: "Women Leadership Summit", date: "Aug 28, 2025", registrations: 54, capacity: 80, status: "upcoming" },
  { id: 3, title: "Digital Skills Bootcamp   Cohort 7", date: "Jul 1 – Sep 30", registrations: 40, capacity: 40, status: "ongoing" },
  { id: 4, title: "Rural Health Camp   Alwar", date: "Jun 22, 2025", registrations: 210, capacity: 200, status: "completed" },
];

export const ADMIN_REGISTRATIONS = [
  { id: "REG-1041", name: "Sunita Verma", event: "Women Leadership Summit", date: "Jul 10, 2025", status: "confirmed" },
  { id: "REG-1040", name: "Arvind Patel", event: "Annual Green Earth Drive", date: "Jul 9, 2025", status: "confirmed" },
  { id: "REG-1039", name: "Kavya Nair", event: "Digital Skills Bootcamp", date: "Jul 8, 2025", status: "pending" },
  { id: "REG-1038", name: "Deepak Singh", event: "Annual Green Earth Drive", date: "Jul 8, 2025", status: "confirmed" },
  { id: "REG-1037", name: "Meera Joshi", event: "Women Leadership Summit", date: "Jul 7, 2025", status: "cancelled" },
];
