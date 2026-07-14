import { useState } from "react";
import { Link } from "react-router";
import {
  Heart, BarChart2, Calendar, Users, Image, Edit2, Settings,
  LogOut, Bell, ArrowRight, Plus, Trash2, Eye, Upload, Search,
  DollarSign, TrendingUp
} from "lucide-react";
import { ADMIN_EVENTS, ADMIN_REGISTRATIONS, GALLERY_IMAGES } from "../data";
import { StatusBadge } from "../components/Layout";

type AdminTab = "dashboard" | "events" | "registrations" | "gallery" | "content" | "settings";

function AdminDashboard() {
  const metrics = [
    { label: "Total Registrations", value: "1,284", change: "+12%", icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Events This Month", value: "7", change: "+3", icon: Calendar, color: "text-emerald-600 bg-emerald-50" },
    { label: "Donations (₹)", value: "4,82,000", change: "+24%", icon: DollarSign, color: "text-amber-600 bg-amber-50" },
    { label: "Website Visitors", value: "18,340", change: "+8%", icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Dashboard Overview</h2>
        <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>Last updated: July 14, 2025 · 09:41 AM</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.color}`}>
                <m.icon size={18} />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                {m.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-0.5"
              style={{ fontFamily: "'Playfair Display', serif" }}>{m.value}</p>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Recent Registrations</h3>
          <div className="space-y-3">
            {ADMIN_REGISTRATIONS.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>{r.name}</p>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>{r.event}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Event Capacity</h3>
          <div className="space-y-5">
            {ADMIN_EVENTS.slice(0, 3).map(ev => {
              const pct = Math.round((ev.registrations / ev.capacity) * 100);
              return (
                <div key={ev.id}>
                  <div className="flex justify-between mb-1.5">
                    <p className="text-xs font-medium text-foreground truncate pr-4" style={{ fontFamily: "'Lato', sans-serif" }}>{ev.title}</p>
                    <span className="text-xs text-muted-foreground shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {ev.registrations}/{ev.capacity}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className={`h-2 rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-primary"}`}
                      style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminEventsTab() {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Event Management</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-bold hover:opacity-90 transition-opacity"
          style={{ fontFamily: "'Lato', sans-serif" }}>
          <Plus size={14} /> New Event
        </button>
      </div>
      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Create New Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Event Title", "Category", "Date", "Venue", "Capacity", "Registration Deadline"].map(f => (
              <div key={f}>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block"
                  style={{ fontFamily: "'DM Mono', monospace" }}>{f}</label>
                <input className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                  placeholder={f} />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block"
                style={{ fontFamily: "'DM Mono', monospace" }}>Description</label>
              <textarea rows={3} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm outline-none focus:border-primary transition-colors resize-none" />
            </div>
            <div className="md:col-span-2">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>Click to upload event banner</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded text-sm font-bold"
              style={{ fontFamily: "'Lato', sans-serif" }}>Save Event</button>
            <button onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-border rounded text-sm font-medium hover:bg-muted transition-colors"
              style={{ fontFamily: "'Lato', sans-serif" }}>Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-muted/60 border-b border-border">
            <tr>
              {["Title", "Date", "Registrations", "Capacity", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest"
                  style={{ fontFamily: "'DM Mono', monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ADMIN_EVENTS.map(ev => (
              <tr key={ev.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>{ev.title}</td>
                <td className="px-4 py-3 text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{ev.date}</td>
                <td className="px-4 py-3 text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{ev.registrations}</td>
                <td className="px-4 py-3 text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{ev.capacity}</td>
                <td className="px-4 py-3"><StatusBadge status={ev.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-primary"><Edit2 size={14} /></button>
                    <button className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminRegistrationsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Registrations</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="pl-9 pr-4 py-2 rounded-lg bg-muted border border-border text-sm outline-none focus:border-primary transition-colors w-48"
              placeholder="Search..." />
          </div>
          <button className="px-4 py-2 border border-border rounded text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            Export CSV
          </button>
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[580px]">
          <thead className="bg-muted/60 border-b border-border">
            <tr>
              {["ID", "Name", "Event", "Date", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest"
                  style={{ fontFamily: "'DM Mono', monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ADMIN_REGISTRATIONS.map(r => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{r.id}</td>
                <td className="px-4 py-3 font-medium text-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate" style={{ fontFamily: "'Lato', sans-serif" }}>{r.event}</td>
                <td className="px-4 py-3 text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{r.date}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-primary"><Eye size={14} /></button>
                    <button className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const tabs: { key: AdminTab; label: string; icon: React.ElementType }[] = [
    { key: "dashboard", label: "Dashboard", icon: BarChart2 },
    { key: "events", label: "Events", icon: Calendar },
    { key: "registrations", label: "Registrations", icon: Users },
    { key: "gallery", label: "Gallery", icon: Image },
    { key: "content", label: "Content", icon: Edit2 },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 bg-card border-r border-border flex flex-col shrink-0">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <Heart size={12} className="text-primary-foreground" fill="currentColor" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>AadhaarSeva</p>
            <p className="text-[10px] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeTab === t.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              style={{ fontFamily: "'Lato', sans-serif" }}>
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Link to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            <ArrowRight size={16} className="rotate-180" /> Back to Website
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div>
            <h1 className="text-sm font-bold text-foreground capitalize" style={{ fontFamily: "'Lato', sans-serif" }}>{activeTab}</h1>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>July 14, 2025</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">KM</div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>Dr. Kamla Mishra</p>
                <p className="text-[10px] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>Super Admin</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "events" && <AdminEventsTab />}
          {activeTab === "registrations" && <AdminRegistrationsTab />}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Gallery Management</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-bold hover:opacity-90 transition-opacity"
                  style={{ fontFamily: "'Lato', sans-serif" }}>
                  <Upload size={14} /> Upload Media
                </button>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary transition-colors bg-card">
                <Upload size={28} className="mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium text-foreground mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Drag & drop photos or videos</p>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>JPG, PNG, MP4 · Max 50MB each</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {GALLERY_IMAGES.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden bg-muted aspect-square">
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40"><Edit2 size={14} /></button>
                      <button className="p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-red-500/80"><Trash2 size={14} /></button>
                    </div>
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">{img.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "content" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Content Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {["Hero Banner", "About Section", "Services", "News & Articles", "Testimonials", "Footer Links"].map(section => (
                  <div key={section} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between group cursor-pointer hover:border-primary transition-colors">
                    <div>
                      <p className="font-bold text-sm text-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>{section}</p>
                      <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'Lato', sans-serif" }}>Click to edit</p>
                    </div>
                    <Edit2 size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Website Settings</h2>
              {[
                { section: "Organization Info", fields: ["Organization Name", "Tagline", "Founded Year", "Registration Number"] },
                { section: "Contact Details", fields: ["Phone Number", "Email Address", "WhatsApp Number", "Office Address"] },
                { section: "Social Media", fields: ["Facebook URL", "Twitter URL", "Instagram URL", "YouTube URL"] },
              ].map(group => (
                <div key={group.section} className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-bold mb-4 pb-3 border-b border-border" style={{ fontFamily: "'Playfair Display', serif" }}>{group.section}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {group.fields.map(f => (
                      <div key={f}>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block"
                          style={{ fontFamily: "'DM Mono', monospace" }}>{f}</label>
                        <input className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                          defaultValue={f === "Organization Name" ? "AadhaarSeva Foundation" : ""} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ fontFamily: "'Lato', sans-serif" }}>
                Save All Changes
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
