export const EVENTS = [
  {
    id: 1, status: "upcoming", category: "Environment",
    title: "Annual Green Earth Drive 2025",
    date: "August 12, 2025", venue: "Central Park, New Delhi",
    desc: "Join 500+ volunteers for our largest tree plantation event. Refreshments provided for all participants. Certificate of participation issued.",
    banner: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&h=400&fit=crop&auto=format",
    seats: 120, deadline: "August 5, 2025",
  },
  {
    id: 2, status: "upcoming", category: "Women",
    title: "Women Leadership Summit 2025",
    date: "August 28–30, 2025", venue: "Convention Centre, Mumbai",
    desc: "Three-day summit featuring keynotes, panel discussions, and networking sessions for women change-makers across sectors.",
    banner: "https://images.unsplash.com/photo-1573164574472-797cdf4a583a?w=700&h=400&fit=crop&auto=format",
    seats: 80, deadline: "August 20, 2025",
  },
  {
    id: 3, status: "ongoing", category: "Education",
    title: "Digital Skills Bootcamp — Cohort 7",
    date: "July 1 – September 30, 2025", venue: "Online + Jaipur Hub",
    desc: "90-day intensive bootcamp covering web development, data entry, and digital marketing. Placement assistance provided.",
    banner: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=400&fit=crop&auto=format",
    seats: 40, deadline: "Ongoing enrollment",
  },
  {
    id: 4, status: "upcoming", category: "Health",
    title: "Rural Health & Nutrition Camp",
    date: "September 6, 2025", venue: "Alwar District, Rajasthan",
    desc: "Free health check-ups, nutritional counselling, and medicine distribution for rural families across 12 villages.",
    banner: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&h=400&fit=crop&auto=format",
    seats: 300, deadline: "Walk-in welcome",
  },
  {
    id: 5, status: "completed", category: "Community",
    title: "Swachh Basti Abhiyan — Phase III",
    date: "May 15, 2025", venue: "Dharavi, Mumbai",
    desc: "Community-led sanitation drive reaching 2,400 households. Installed 18 water purification units and trained 60 sanitation workers.",
    banner: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=700&h=400&fit=crop&auto=format",
    seats: 0, deadline: "Completed",
  },
];

export const SERVICES = [
  { slug: "skill-development", icon: "BookOpen", title: "Skill Development", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&fit=crop&q=80", color: "bg-amber-50", textColor: "text-amber-700", desc: "Vocational training, digital literacy, and livelihood programs empowering individuals to build sustainable futures.", details: "Our skill development centres operate in 14 cities and have trained over 8,200 individuals since 2012. Programs range from basic computer literacy to advanced coding bootcamps and artisan crafts. Each trainee receives placement support and a recognised certification upon completion." },
  { slug: "environment", icon: "Leaf", title: "Environmental Awareness", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&fit=crop&q=80", color: "bg-emerald-50", textColor: "text-emerald-700", desc: "Tree plantation drives, waste management campaigns, and conservation workshops for a greener tomorrow.", details: "We have planted 1.2 million saplings across 9 states, partnered with 80 municipal bodies for waste segregation, and run 340 school-level conservation workshops annually. Our Green Schools Program currently covers 220 government schools." },
  { slug: "women-empowerment", icon: "Users", title: "Women Empowerment", img: "https://images.unsplash.com/photo-1573164574397-dd250bc8a598?w=800&fit=crop&q=80", color: "bg-rose-50", textColor: "text-rose-700", desc: "Self-help groups, legal aid, health camps, and entrepreneurship support for women across communities.", details: "3,200 women are active members of our self-help groups across rural and peri-urban areas. We provide micro-finance linkages, legal awareness camps, free health check-ups, and business incubation support for women entrepreneurs." },
  { slug: "community-development", icon: "Globe", title: "Community Development", img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&fit=crop&q=80", color: "bg-blue-50", textColor: "text-blue-700", desc: "Infrastructure improvement, sanitation projects, and local governance engagement for stronger communities.", details: "From building village libraries to installing solar street lights, our community projects are co-designed with residents. We have completed 140+ infrastructure projects across 9 states with funding from government schemes and corporate CSR." },
  { slug: "social-welfare", icon: "Shield", title: "Social Welfare", img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&fit=crop&q=80", color: "bg-purple-50", textColor: "text-purple-700", desc: "Food security programs, emergency relief, and support networks for the marginalized and vulnerable.", details: "Our food security program distributes 18,000 nutrition packets monthly. Emergency relief operations have reached 22,000+ families during natural disasters. We also run 4 shelter homes and 2 old-age care centres." },
  { slug: "training-workshops", icon: "Handshake", title: "Training Workshops", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&fit=crop&q=80", color: "bg-orange-50", textColor: "text-orange-700", desc: "Expert-led workshops on health, rights, financial literacy, and sustainable livelihoods.", details: "450+ workshops conducted annually with over 38,000 participants. Topics include personal finance, reproductive health, disaster preparedness, legal rights, and sustainable farming. All workshops are free of charge for participants." },
];

export const NEWS = [
  { id: 1, date: "July 8, 2025", tag: "Campaign", title: "'Clean Ganga, Green India' Campaign Reaches 5,000 Households", excerpt: "Our month-long awareness campaign in the Gangetic plain region achieved unprecedented reach, partnering with 30 local panchayats across four districts.", img: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=380&fit=crop&auto=format" },
  { id: 2, date: "June 30, 2025", tag: "Recognition", title: "Organization Wins National NGO Excellence Award 2025", excerpt: "We are honored to receive this recognition for outstanding contribution to rural livelihood development and women empowerment programs across 9 states.", img: "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=600&h=380&fit=crop&auto=format" },
  { id: 3, date: "June 15, 2025", tag: "Partnership", title: "MoU Signed with State Education Department for Digital Literacy", excerpt: "A landmark agreement to deploy our Digital Skills Bootcamp across 120 government schools in three districts over the next 18 months.", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=380&fit=crop&auto=format" },
  { id: 4, date: "May 28, 2025", tag: "Impact", title: "12,400 Lives Impacted in FY 2024-25 — Annual Report Released", excerpt: "Our annual impact report documents 12,400 direct beneficiaries, ₹4.8 Cr in program expenditure, and a 94% program completion rate for the financial year.", img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=380&fit=crop&auto=format" },
  { id: 5, date: "May 10, 2025", tag: "Community", title: "50 Women Graduate from Entrepreneurship Bootcamp in Jaipur", excerpt: "The third cohort of our women's entrepreneurship bootcamp concludes with 50 graduates, 32 of whom have already launched micro-enterprises.", img: "https://images.unsplash.com/photo-1573164574397-dd250bc8a598?w=600&h=380&fit=crop&auto=format" },
  { id: 6, date: "April 22, 2025", tag: "Environment", title: "Earth Day 2025: 40,000 Saplings Planted Across 9 States", excerpt: "In our largest single-day plantation drive, 3,200 volunteers planted 40,000 saplings in coordinated events across all nine states of operation.", img: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&h=380&fit=crop&auto=format" },
];

export const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=450&fit=crop&auto=format", alt: "Community volunteers at tree plantation drive", tag: "Environment" },
  { src: "https://images.unsplash.com/photo-1573164574397-dd250bc8a598?w=600&h=450&fit=crop&auto=format", alt: "Women empowerment workshop session", tag: "Women" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=450&fit=crop&auto=format", alt: "Food distribution drive for rural communities", tag: "Welfare" },
  { src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&h=450&fit=crop&auto=format", alt: "Children at skill development centre", tag: "Education" },
  { src: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&h=450&fit=crop&auto=format", alt: "Annual gathering of volunteers", tag: "Events" },
  { src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&h=450&fit=crop&auto=format", alt: "Health camp in rural village", tag: "Health" },
  { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=450&fit=crop&auto=format", alt: "Medical volunteer camp", tag: "Health" },
  { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=450&fit=crop&auto=format", alt: "Digital skills training session", tag: "Education" },
  { src: "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=600&h=450&fit=crop&auto=format", alt: "Award ceremony and recognition", tag: "Events" },
];

export const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Beneficiary, Women Empowerment Program", quote: "The self-help group changed my life completely. I now run a small tailoring business and support my children's education independently.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=80&h=80&fit=crop&auto=format" },
  { name: "Rahul Mehta", role: "Volunteer, 3 Years", quote: "Working with this organization has given me purpose beyond my profession. The transparency, passion, and community spirit here is unmatched.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" },
  { name: "Anita Desai", role: "Corporate Partner, TechCorp India", quote: "Our CSR partnership has been incredibly impactful. The team's execution is flawless and reporting is detailed — we renewed for a third year.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format" },
];

export const STATS = [
  { value: "12,400+", label: "Lives Impacted" },
  { value: "340+", label: "Events Organized" },
  { value: "28", label: "Active Programs" },
  { value: "95%", label: "Volunteer Satisfaction" },
];

export const ADMIN_EVENTS = [
  { id: 1, title: "Annual Green Earth Drive 2025", date: "Aug 12, 2025", registrations: 78, capacity: 120, status: "upcoming" },
  { id: 2, title: "Women Leadership Summit", date: "Aug 28, 2025", registrations: 54, capacity: 80, status: "upcoming" },
  { id: 3, title: "Digital Skills Bootcamp — Cohort 7", date: "Jul 1 – Sep 30", registrations: 40, capacity: 40, status: "ongoing" },
  { id: 4, title: "Rural Health Camp — Alwar", date: "Jun 22, 2025", registrations: 210, capacity: 200, status: "completed" },
];

export const ADMIN_REGISTRATIONS = [
  { id: "REG-1041", name: "Sunita Verma", event: "Women Leadership Summit", date: "Jul 10, 2025", status: "confirmed" },
  { id: "REG-1040", name: "Arvind Patel", event: "Annual Green Earth Drive", date: "Jul 9, 2025", status: "confirmed" },
  { id: "REG-1039", name: "Kavya Nair", event: "Digital Skills Bootcamp", date: "Jul 8, 2025", status: "pending" },
  { id: "REG-1038", name: "Deepak Singh", event: "Annual Green Earth Drive", date: "Jul 8, 2025", status: "confirmed" },
  { id: "REG-1037", name: "Meera Joshi", event: "Women Leadership Summit", date: "Jul 7, 2025", status: "cancelled" },
];
