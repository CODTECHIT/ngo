import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";
import {
  Heart, BarChart2, Calendar, Users, Image, Edit2, Settings,
  LogOut, Bell, ArrowRight, Plus, Trash2, Eye, Upload, Search,
  DollarSign, TrendingUp, MessageSquare
} from "lucide-react";
import { ADMIN_EVENTS, ADMIN_REGISTRATIONS, GALLERY_IMAGES } from "../data";
import { StatusBadge } from "../components/Layout";

type AdminTab = "dashboard" | "events" | "registrations" | "gallery" | "content" | "settings" | "messages";

function AdminDashboard() {
  const metrics = [
    { label: "Total Registrations", value: "1,284", change: "+12%", icon: Users, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { label: "Events This Month", value: "7", change: "+3", icon: Calendar, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { label: "Donations (₹)", value: "4,82,000", change: "+24%", icon: DollarSign, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { label: "Website Visitors", value: "18,340", change: "+8%", icon: TrendingUp, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1 text-white tracking-tight">Dashboard Overview</h2>
        <p className="text-zinc-500 text-sm font-light">Last updated: July 14, 2025 · 09:41 AM</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map(m => (
          <div key={m.label} className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 hover:bg-zinc-900 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${m.color}`}>
                <m.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-full uppercase tracking-widest">
                {m.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{m.value}</p>
            <p className="text-xs text-zinc-400 font-medium">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6">
          <h3 className="font-bold mb-6 text-white tracking-tight">Recent Registrations</h3>
          <div className="space-y-4">
            {ADMIN_REGISTRATIONS.map(r => (
              <div key={r.id} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-bold text-white">{r.name}</p>
                  <p className="text-xs text-zinc-500">{r.event}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6">
          <h3 className="font-bold mb-6 text-white tracking-tight">Event Capacity</h3>
          <div className="space-y-6">
            {ADMIN_EVENTS.slice(0, 3).map(ev => {
              const pct = Math.round((ev.registrations / ev.capacity) * 100);
              return (
                <div key={ev.id}>
                  <div className="flex justify-between mb-2">
                    <p className="text-xs font-bold text-white truncate pr-4">{ev.title}</p>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {ev.registrations}/{ev.capacity}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-primary"}`}
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
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvents()
      .then(res => setEvents(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">Event Management</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <Plus size={16} /> New Event
        </button>
      </div>
      {showForm && (
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight relative z-10">Create New Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {["Event Title", "Category", "Date", "Venue", "Capacity", "Registration Deadline"].map(f => (
              <div key={f}>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">{f}</label>
                <input className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary/50 focus:bg-white/10 transition-colors placeholder:text-zinc-600"
                  placeholder={f} />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Description</label>
              <textarea rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary/50 focus:bg-white/10 transition-colors resize-none placeholder:text-zinc-600" placeholder="Event details..." />
            </div>
            <div className="md:col-span-2">
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors bg-white/[0.02]">
                <Upload size={24} className="mx-auto mb-3 text-zinc-500" />
                <p className="text-sm font-medium text-zinc-300">Click to upload event banner</p>
                <p className="text-xs text-zinc-500 mt-1">1920x1080 recommended</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-8 relative z-10">
            <button className="px-8 py-3 bg-white text-black rounded-xl text-sm font-bold hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all">
              Save Event
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-8 py-3 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/5 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="bg-zinc-900/50 rounded-2xl border border-white/5 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-black/20 border-b border-white/5">
            <tr>
              {["Title", "Date", "Capacity", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="p-8 text-center">Loading events...</td></tr> : 
             events.length === 0 ? <tr><td colSpan={5} className="p-8 text-center">No events found.</td></tr> :
             events.map(ev => (
              <tr key={ev._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-bold text-white">{ev.title}</td>
                <td className="px-6 py-4 text-xs font-medium text-zinc-400">{ev.date}</td>
                <td className="px-6 py-4 text-xs font-medium text-zinc-400">{ev.seats}</td>
                <td className="px-6 py-4"><StatusBadge status={ev.status} /></td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"><Edit2 size={14} /></button>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors text-zinc-400 hover:text-red-400"><Trash2 size={14} /></button>
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
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllRegistrations()
      .then(res => setRegistrations(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">Registrations</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input className="pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-white text-sm outline-none focus:border-primary/50 focus:bg-white/5 transition-colors w-64 placeholder:text-zinc-600"
              placeholder="Search..." />
          </div>
          <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-colors">
            Export CSV
          </button>
        </div>
      </div>
      <div className="bg-zinc-900/50 rounded-2xl border border-white/5 overflow-x-auto">
        <table className="w-full text-sm min-w-[580px]">
          <thead className="bg-black/20 border-b border-white/5">
            <tr>
              {["ID", "Name", "Event", "Date", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="p-8 text-center">Loading registrations...</td></tr> : 
             registrations.length === 0 ? <tr><td colSpan={6} className="p-8 text-center">No registrations found.</td></tr> :
             registrations.map(r => (
              <tr key={r._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{r._id.substring(0, 6)}</td>
                <td className="px-6 py-4 font-bold text-white">{r.userId?.fname} {r.userId?.lname}</td>
                <td className="px-6 py-4 text-xs font-medium text-zinc-400 max-w-[160px] truncate">{r.eventId?.title}</td>
                <td className="px-6 py-4 text-xs font-medium text-zinc-400">{new Date(r.registeredAt).toLocaleDateString()}</td>
                <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"><Eye size={14} /></button>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors text-zinc-400 hover:text-red-400"><Trash2 size={14} /></button>
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

function AdminMessagesTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMessages()
      .then(res => setMessages(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-zinc-400">Loading messages...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Messages</h2>
          <p className="text-sm text-zinc-400 font-medium">Inquiries from the Contact Form</p>
        </div>
      </div>
      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name</th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Subject</th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">No messages found.</td>
              </tr>
            ) : (
              messages.map((m: any) => (
                <tr key={m._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="p-4 text-sm text-zinc-400 whitespace-nowrap">{new Date(m.date).toLocaleDateString()}</td>
                  <td className="p-4 text-sm font-bold text-white whitespace-nowrap">{m.fname} {m.lname}</td>
                  <td className="p-4 text-sm text-zinc-400 whitespace-nowrap">{m.email}</td>
                  <td className="p-4 text-sm font-bold text-primary whitespace-nowrap">{m.subject}</td>
                  <td className="p-4 text-sm text-zinc-300 max-w-xs truncate">{m.message}</td>
                </tr>
              ))
            )}
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
    { key: "messages", label: "Messages", icon: MessageSquare },
    { key: "content", label: "Content", icon: Edit2 },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-white/10 flex flex-col shrink-0">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Heart size={14} className="text-white" fill="currentColor" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none tracking-tight">LEAD TO SERVE</p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === t.key ? "bg-primary/20 text-primary border border-primary/20" : "text-zinc-500 border border-transparent hover:text-white hover:bg-white/5"}`}>
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent transition-colors">
            <ArrowRight size={18} className="rotate-180" /> Back to Website
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 border border-transparent hover:bg-red-500/10 hover:border-red-500/20 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      
      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
        {/* Subtle background glow for main area */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
        
        <header className="h-20 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-8 relative z-10">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight capitalize">{activeTab}</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">July 14, 2025</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-zinc-400 hover:text-white">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            </button>
            <div className="w-px h-8 bg-white/10 mx-2" />
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-white">Dr. Kamla Mishra</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shadow-lg border border-white/10">KM</div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "events" && <AdminEventsTab />}
          {activeTab === "registrations" && <AdminRegistrationsTab />}
          {activeTab === "messages" && <AdminMessagesTab />}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white tracking-tight">Gallery Management</h2>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all">
                  <Upload size={16} /> Upload Media
                </button>
              </div>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors bg-white/[0.02]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Upload size={24} className="text-zinc-400" />
                </div>
                <p className="font-bold text-white mb-2">Drag & drop photos or videos</p>
                <p className="text-xs font-medium text-zinc-500">JPG, PNG, MP4 · Max 50MB each</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {GALLERY_IMAGES.map((img, i) => (
                  <div key={i} className="relative group rounded-2xl overflow-hidden bg-zinc-900 aspect-square border border-white/5 hover:border-white/20 transition-all">
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-60 transition-all duration-500" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all"><Edit2 size={16} /></button>
                      <button className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-red-500/40 hover:border-red-500/50 hover:scale-110 transition-all"><Trash2 size={16} /></button>
                    </div>
                    <span className="absolute bottom-3 left-3 bg-black/80 border border-white/10 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-md">{img.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "content" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Content Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {["Hero Banner", "About Section", "Services", "News & Articles", "Testimonials", "Footer Links"].map(section => (
                  <div key={section} className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 flex items-center justify-between group cursor-pointer hover:border-primary/50 hover:bg-white/[0.02] transition-all">
                    <div>
                      <p className="font-bold text-white">{section}</p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Click to edit</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:text-primary transition-all">
                      <Edit2 size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="space-y-8 max-w-3xl">
              <h2 className="text-2xl font-bold text-white tracking-tight">Website Settings</h2>
              {[
                { section: "Organization Info", fields: ["Organization Name", "Tagline", "Founded Year", "Registration Number"] },
                { section: "Contact Details", fields: ["Phone Number", "Email Address", "WhatsApp Number", "Office Address"] },
                { section: "Social Media", fields: ["Facebook URL", "Twitter URL", "Instagram URL", "YouTube URL"] },
              ].map(group => (
                <div key={group.section} className="bg-zinc-900/50 rounded-3xl border border-white/5 p-8">
                  <h3 className="font-bold text-lg text-white mb-6 tracking-tight">{group.section}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {group.fields.map(f => (
                      <div key={f}>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">{f}</label>
                        <input className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary/50 focus:bg-white/10 transition-colors placeholder:text-zinc-600"
                          defaultValue={f === "Organization Name" ? "LEAD TO SERVE Foundation" : ""} placeholder={`Enter ${f.toLowerCase()}`} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <button className="px-10 py-4 bg-white text-black rounded-xl font-bold text-sm hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                  Save All Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
