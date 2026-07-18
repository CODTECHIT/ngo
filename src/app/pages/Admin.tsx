import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";
import {
  Heart, BarChart2, Calendar, Users, Image, Edit2, Settings,
  LogOut, Bell, ArrowRight, Plus, Trash2, Eye, Upload, Search,
  DollarSign, TrendingUp, MessageSquare, FileText
} from "lucide-react";
import { supabaseAdmin as supabase } from '../../lib/supabase';
import { StatusBadge } from "../components/Layout";

// Extend Window interface for Cloudinary
declare global {
  interface Window {
    cloudinary: any;
  }
}

const openCloudinaryWidget = (onSuccess: (info: any) => void) => {
  if (!window.cloudinary) {
    alert("Cloudinary widget not loaded yet");
    return;
  }
  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      sources: ['local', 'url', 'camera'],
      multiple: false
    },
    (error: any, result: any) => {
      if (!error && result && result.event === "success") {
        onSuccess(result.info);
      }
    }
  );
  widget.open();
};

type AdminTab = "dashboard" | "events" | "registrations" | "gallery" | "content" | "settings" | "messages";

function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalRegistrations: 0,
    eventsThisMonth: 0,
    messagesCount: 0
  });
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
  const [eventCapacity, setEventCapacity] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [{ count: regCount }, { count: eventsCount }, { count: messagesCount }, { data: recentRegs }, { data: eventsData }] = await Promise.all([
        supabase.from('registrations').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('registrations').select('*, events(*), profiles(*)').order('registered_at', { ascending: false }).limit(5),
        supabase.from('events').select('*').order('created_at', { ascending: false }).limit(3)
      ]);

      setMetrics({
        totalRegistrations: regCount || 0,
        eventsThisMonth: eventsCount || 0,
        messagesCount: messagesCount || 0
      });
      setRecentRegistrations(recentRegs || []);

      if (eventsData) {
        const capacityData = await Promise.all(eventsData.map(async (ev) => {
          const { count } = await supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('event_id', ev.id);
          return {
            id: ev.id,
            title: ev.title,
            capacity: ev.seats || 100,
            registrations: count || 0
          };
        }));
        setEventCapacity(capacityData);
      }
    };
    fetchData();
  }, []);

  const displayMetrics = [
    { label: "Total Registrations", value: metrics.totalRegistrations.toString(), change: "Active", icon: Users, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { label: "Total Events", value: metrics.eventsThisMonth.toString(), change: "Active", icon: Calendar, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { label: "Total Messages", value: metrics.messagesCount.toString(), change: "Active", icon: MessageSquare, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1 text-zinc-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-zinc-500 text-sm font-light">Real-time Data</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayMetrics.map(m => (
          <div key={m.label} className="bg-black/5 rounded-2xl border border-black/5 p-6 hover:bg-black/10 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${m.color}`}>
                <m.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full uppercase tracking-widest">
                {m.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-zinc-900 mb-1">{m.value}</p>
            <p className="text-xs text-zinc-600 font-medium">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/5 rounded-2xl border border-black/5 p-6">
          <h3 className="font-bold mb-6 text-zinc-900 tracking-tight">Recent Registrations</h3>
          <div className="space-y-4">
            {recentRegistrations.map(r => (
              <div key={r.id} className="flex items-center justify-between pb-4 border-b border-black/5 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-bold text-zinc-900">{r.profiles?.full_name}</p>
                  <p className="text-xs text-zinc-500">{r.events?.title}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
            {recentRegistrations.length === 0 && <p className="text-sm text-zinc-500">No registrations found.</p>}
          </div>
        </div>
        <div className="bg-black/5 rounded-2xl border border-black/5 p-6">
          <h3 className="font-bold mb-6 text-zinc-900 tracking-tight">Event Capacity</h3>
          <div className="space-y-6">
            {eventCapacity.map(ev => {
              const pct = Math.round((ev.registrations / ev.capacity) * 100);
              return (
                <div key={ev.id}>
                  <div className="flex justify-between mb-2">
                    <p className="text-xs font-bold text-zinc-900 truncate pr-4">{ev.title}</p>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {ev.registrations}/{ev.capacity}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-black/5 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-primary"}`}
                      style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              );
            })}
            {eventCapacity.length === 0 && <p className="text-sm text-zinc-500">No events to display.</p>}
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

  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerPublicId, setBannerPublicId] = useState("");
  const [certificateTemplateUrl, setCertificateTemplateUrl] = useState("");
  const [formData, setFormData] = useState({
    title: "", category: "", event_date: "", venue: "", seats: "", registration_deadline: "", description: ""
  });

  const loadEvents = () => {
    setLoading(true);
    api.getEvents()
      .then(res => setEvents(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSaveEvent = async () => {
    try {
      await api.createEvent({
        ...formData,
        seats: parseInt(formData.seats),
        banner_url: bannerUrl,
        banner_public_id: bannerPublicId,
        certificate_template_url: certificateTemplateUrl,
        status: "upcoming"
      });
      setShowForm(false);
      setFormData({ title: "", category: "", event_date: "", venue: "", seats: "", registration_deadline: "", description: "" });
      setBannerUrl("");
      setBannerPublicId("");
      setCertificateTemplateUrl("");
      loadEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to save event");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Event Management</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(15,110,110,0.3)]">
          <Plus size={16} /> New Event
        </button>
      </div>
      {showForm && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-black/10 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
          <h3 className="text-xl font-bold text-zinc-900 mb-6 tracking-tight relative z-10">Create New Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {Object.keys(formData).map(f => {
              if (f === "description") return null;
              return (
                <div key={f}>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">{f.replace('_', ' ')}</label>
                  <input 
                    type={f.includes('date') || f === 'registration_deadline' ? 'date' : f === 'seats' ? 'number' : 'text'}
                    value={(formData as any)[f]} 
                    onChange={e => setFormData({...formData, [f]: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/10 transition-colors placeholder:text-zinc-500"
                    placeholder={f} />
                </div>
              );
            })}
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Description</label>
              <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/10 transition-colors resize-none placeholder:text-zinc-500" placeholder="Event details..." />
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div 
                  onClick={() => openCloudinaryWidget((info) => {
                    setBannerUrl(info.secure_url);
                    setBannerPublicId(info.public_id);
                  })}
                  className="border-2 border-dashed border-black/10 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors bg-black/[0.02] flex flex-col justify-center">
                  {bannerUrl ? (
                    <img src={bannerUrl} alt="Banner" className="h-32 mx-auto object-contain rounded" />
                  ) : (
                    <>
                      <Upload size={24} className="mx-auto mb-3 text-zinc-500" />
                      <p className="text-sm font-medium text-zinc-700">Click to upload event banner</p>
                      <p className="text-xs text-zinc-500 mt-1">1920x1080 recommended</p>
                    </>
                  )}
                </div>
                
                <div 
                  onClick={() => openCloudinaryWidget((info) => {
                    setCertificateTemplateUrl(info.secure_url);
                  })}
                  className="border-2 border-dashed border-black/10 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors bg-black/[0.02] flex flex-col justify-center">
                  {certificateTemplateUrl ? (
                    <div className="text-emerald-600 flex flex-col items-center">
                      <FileText size={40} className="mb-3" />
                      <p className="text-sm font-medium">Certificate PDF Uploaded</p>
                      <a href={certificateTemplateUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline mt-2 text-primary" onClick={e => e.stopPropagation()}>View PDF</a>
                    </div>
                  ) : (
                    <>
                      <FileText size={24} className="mx-auto mb-3 text-zinc-500" />
                      <p className="text-sm font-medium text-zinc-700">Upload Certificate Template (PDF)</p>
                      <p className="text-xs text-zinc-500 mt-1">Required for participant downloads</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-8 relative z-10">
            <button onClick={handleSaveEvent} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:shadow-[0_0_15px_rgba(15,110,110,0.3)] transition-all">
              Save Event
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-8 py-3 border border-black/10 rounded-xl text-sm font-bold text-zinc-900 hover:bg-black/5 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="bg-black/5 rounded-2xl border border-black/5 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-black/5 border-b border-black/5">
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
              <tr key={ev.id} className="border-b border-black/5 last:border-0 hover:bg-black/5 transition-colors">
                <td className="px-6 py-4 font-bold text-zinc-900">{ev.title}</td>
                <td className="px-6 py-4 text-xs font-medium text-zinc-600">{new Date(ev.event_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-xs font-medium text-zinc-600">{ev.seats}</td>
                <td className="px-6 py-4"><StatusBadge status={ev.status} /></td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-black/5 hover:bg-black/10 transition-colors text-zinc-500 hover:text-zinc-900"><Edit2 size={14} /></button>
                    <button className="p-2 rounded-lg bg-black/5 hover:bg-red-500/20 transition-colors text-zinc-500 hover:text-red-600" onClick={async () => {
                      await api.deleteEvent(ev.id);
                      setEvents(events.filter(e => e.id !== ev.id));
                    }}><Trash2 size={14} /></button>
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
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Registrations</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input className="pl-10 pr-4 py-2.5 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/10 transition-colors w-64 placeholder:text-zinc-500"
              placeholder="Search..." />
          </div>
          <button className="px-5 py-2.5 bg-black/5 border border-black/10 rounded-xl text-xs font-bold text-zinc-900 hover:bg-black/10 transition-colors">
            Export CSV
          </button>
        </div>
      </div>
      <div className="bg-black/5 rounded-2xl border border-black/5 overflow-x-auto">
        <table className="w-full text-sm min-w-[580px]">
          <thead className="bg-black/5 border-b border-black/5">
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
              <tr key={r.id} className="border-b border-black/5 last:border-0 hover:bg-black/5 transition-colors">
                <td className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{r.id.substring(0, 8)}</td>
                <td className="px-6 py-4 font-bold text-zinc-900">{r.profiles?.full_name}</td>
                <td className="px-6 py-4 text-xs font-medium text-zinc-600 max-w-[160px] truncate">{r.events?.title}</td>
                <td className="px-6 py-4 text-xs font-medium text-zinc-600">{new Date(r.registered_at).toLocaleDateString()}</td>
                <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-black/5 hover:bg-black/10 transition-colors text-zinc-500 hover:text-zinc-900"><Eye size={14} /></button>
                    <button className="p-2 rounded-lg bg-black/5 hover:bg-red-500/20 transition-colors text-zinc-500 hover:text-red-600"><Trash2 size={14} /></button>
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
          <h2 className="text-2xl font-bold tracking-tight mb-1 text-zinc-900">Messages</h2>
          <p className="text-sm text-zinc-600 font-medium">Inquiries from the Contact Form</p>
        </div>
      </div>
      <div className="bg-white border border-black/10 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/10 bg-black/[0.02]">
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
                <tr key={m.id} className="border-b border-black/5 hover:bg-black/5 transition-colors group cursor-pointer">
                  <td className="p-4 text-sm text-zinc-600 whitespace-nowrap">{new Date(m.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-sm font-bold text-zinc-900 whitespace-nowrap">{m.fname} {m.lname}</td>
                  <td className="p-4 text-sm text-zinc-600 whitespace-nowrap">{m.email}</td>
                  <td className="p-4 text-sm font-bold text-primary whitespace-nowrap">{m.subject}</td>
                  <td className="p-4 text-sm text-zinc-700 max-w-xs truncate">{m.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminGalleryTab() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadImages = () => {
    setLoading(true);
    supabase.from('gallery_images').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setImages(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleUpload = () => {
    openCloudinaryWidget(async (info) => {
      try {
        await supabase.from('gallery_images').insert([{
          image_url: info.secure_url,
          public_id: info.public_id,
          tag: 'Gallery'
        }]);
        loadImages();
      } catch (err) {
        console.error("Upload error", err);
      }
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('gallery_images').delete().eq('id', id);
      setImages(images.filter(img => img.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Gallery Management</h2>
        <button onClick={handleUpload} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:shadow-[0_0_15px_rgba(15,110,110,0.3)] transition-all">
          <Upload size={16} /> Upload Media
        </button>
      </div>
      <div onClick={handleUpload} className="border-2 border-dashed border-black/10 rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors bg-black/[0.02]">
        <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-black/10">
          <Upload size={24} className="text-zinc-500" />
        </div>
        <p className="font-bold text-zinc-900 mb-2">Click to upload photos or videos</p>
        <p className="text-xs font-medium text-zinc-600">JPG, PNG, MP4 · Max 50MB each</p>
      </div>
      {loading ? <p className="text-zinc-500">Loading gallery...</p> : 
       images.length === 0 ? <p className="text-zinc-500">No images in gallery.</p> : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group rounded-2xl overflow-hidden bg-black/5 aspect-square border border-black/5 hover:border-black/20 transition-all">
            <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-60 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleDelete(img.id)} className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-red-500/80 hover:border-red-500 hover:scale-110 transition-all"><Trash2 size={16} /></button>
            </div>
            <span className="absolute bottom-3 left-3 bg-black/80 border border-white/10 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-md">{img.tag}</span>
          </div>
        ))}
      </div>
      )}
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
    <div className="min-h-screen bg-background flex text-zinc-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/10 flex flex-col shrink-0">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-black/10">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(15,110,110,0.3)]">
            <Heart size={14} className="text-primary-foreground" fill="currentColor" />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900 leading-none tracking-tight">SRISHREEVISION FOUNDATION</p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === t.key ? "bg-primary/20 text-primary border border-primary/20" : "text-zinc-600 border border-transparent hover:text-zinc-900 hover:bg-black/5"}`}>
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-black/10 space-y-2">
          <Link to="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-black/5 border border-transparent transition-colors">
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
        
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-black/10 flex items-center justify-between px-8 relative z-10">
          <div>
            <h1 className="text-lg font-bold text-zinc-900 tracking-tight capitalize">{activeTab}</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">July 14, 2025</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-full bg-black/5 hover:bg-black/10 border border-black/5 hover:border-black/10 transition-all text-zinc-500 hover:text-zinc-900">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(15,110,110,0.8)]" />
            </button>
            <div className="w-px h-8 bg-black/10 mx-2" />
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-zinc-900">Dr. Kamla Mishra</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold shadow-lg border border-black/10">KM</div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "events" && <AdminEventsTab />}
          {activeTab === "registrations" && <AdminRegistrationsTab />}
          {activeTab === "messages" && <AdminMessagesTab />}
          {activeTab === "gallery" && <AdminGalleryTab />}
          {activeTab === "content" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Content Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {["Hero Banner", "About Section", "Services", "News & Articles", "Testimonials", "Footer Links"].map(section => (
                  <div key={section} className="bg-black/5 rounded-2xl border border-black/5 p-6 flex items-center justify-between group cursor-pointer hover:border-primary/50 hover:bg-black/10 transition-all">
                    <div>
                      <p className="font-bold text-zinc-900">{section}</p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Click to edit</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-zinc-500 group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:text-primary transition-all">
                      <Edit2 size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="space-y-8 max-w-3xl">
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Website Settings</h2>
              {[
                { section: "Organization Info", fields: ["Organization Name", "Tagline", "Founded Year", "Registration Number"] },
                { section: "Contact Details", fields: ["Phone Number", "Email Address", "WhatsApp Number", "Office Address"] },
                { section: "Social Media", fields: ["Facebook URL", "Twitter URL", "Instagram URL", "YouTube URL"] },
              ].map(group => (
                <div key={group.section} className="bg-black/5 rounded-3xl border border-black/5 p-8">
                  <h3 className="font-bold text-lg text-zinc-900 mb-6 tracking-tight">{group.section}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {group.fields.map(f => (
                      <div key={f}>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">{f}</label>
                        <input className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors placeholder:text-zinc-500"
                          defaultValue={f === "Organization Name" ? "SRISHREEVISION FOUNDATION" : ""} placeholder={`Enter ${f.toLowerCase()}`} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <button className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:scale-105 shadow-[0_0_20px_rgba(15,110,110,0.2)] transition-all">
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
