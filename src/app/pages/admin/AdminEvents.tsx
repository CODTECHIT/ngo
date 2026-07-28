import { useState } from 'react';
import { supabaseAdmin as supabase } from '../../../lib/supabase';
import { useEvents, type Event } from '../../hooks/useEvents';
import { ImageUploader } from '../../components/ImageUploader';
import { NavLink } from 'react-router';
import { AdminSidebar } from '../../components/AdminSidebar';
import { 
  LayoutDashboard, FileText, List, Calendar, Image as ImageIcon, MessageSquare,
  Plus, Edit2, Trash2, Loader2, X, Users, Search, Download, Mail, Heart
} from 'lucide-react';

export default function AdminEvents() {
  const { events, loading, refetch } = useEvents(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'completed'>('upcoming');
  const [showRegisterButton, setShowRegisterButton] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(0);
  const [certificateTemplateUrl, setCertificateTemplateUrl] = useState('');

  // Registrations state
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [regsLoading, setRegsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openAddModal = () => {
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setEventDate('');
    setLocation('');
    setStatus('upcoming');
    setShowRegisterButton(false);
    setIsFree(true);
    setPrice(0);
    setCertificateTemplateUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (evt: Event) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDescription(evt.description || '');
    setImageUrl(evt.image_url);
    setEventDate(evt.event_date ? evt.event_date.split('T')[0] : '');
    setLocation(evt.location || '');
    setStatus(evt.status);
    setShowRegisterButton(evt.show_register_button);
    setIsFree(evt.is_free ?? true);
    setPrice(evt.price ?? 0);
    setCertificateTemplateUrl(evt.certificate_template_url || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        title,
        description,
        image_url: imageUrl,
        event_date: eventDate || null,
        location,
        status,
        show_register_button: showRegisterButton,
        is_free: isFree,
        price: isFree ? 0 : price,
        certificate_template_url: certificateTemplateUrl
      };

      if (editingEvent) {
        const { error } = await supabase.from('events').update(payload).eq('id', editingEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').insert([payload]);
        if (error) throw error;
      }
      
      await refetch();
      closeModal();
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event? This will also delete any attendee registrations linked to it.")) return;
    try {
      // 1. Delete associated registrations first to avoid foreign key constraint error 23503
      const { error: regError } = await supabase.from('registrations').delete().eq('event_id', id);
      if (regError && regError.code !== 'PGRST116') {
        console.warn("Notice: check on associated registrations before delete:", regError);
      }

      // 2. Delete the event itself
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      await refetch();
    } catch (err: any) {
      console.error("Error deleting event:", err);
      if (err?.code === '23503' || err?.message?.includes('foreign key constraint') || err?.details?.includes('still referenced')) {
        alert("Cannot delete event: It is still referenced by existing attendee records in another database table. Please delete linked attendee records first or enable ON DELETE CASCADE in your Supabase SQL editor.");
      } else {
        alert("Failed to delete event: " + (err?.message || JSON.stringify(err)));
      }
    }
  };

  const openRegistrationsModal = async (evt: Event) => {
    setViewingEvent(evt);
    setSearchQuery('');
    setRegsLoading(true);
    try {
      let dbData: any[] = [];
      const { data, error } = await supabase.from('registrations').select('*').eq('event_id', evt.id).order('registered_at', { ascending: false });
      console.log('AdminEvents registrations fetched:', { data, error, evtId: evt.id });
      if (!error && data) {
        dbData = data;
      }
      
      const localRegs = JSON.parse(localStorage.getItem('ngo_saved_registrations') || '[]');
      const matchingLocal = localRegs.filter((r: any) => 
        r.event_id === evt.id || 
        (r.event_title && evt.title && r.event_title.toLowerCase().trim() === evt.title.toLowerCase().trim())
      );
      
      const combined = [...dbData];
      matchingLocal.forEach((lr: any) => {
        if (!combined.some(c => (c.id && c.id === lr.id) || (c.email && lr.email && c.email.toLowerCase() === lr.email.toLowerCase() && c.name === lr.name))) {
          combined.push(lr);
        }
      });
      console.log('AdminEvents registrations combined (DB + Local fallback):', { count: combined.length, evtId: evt.id });
      setRegistrations(combined);
    } catch (err) {
      console.error(err);
      const localRegs = JSON.parse(localStorage.getItem('ngo_saved_registrations') || '[]');
      const matchingLocal = localRegs.filter((r: any) => 
        r.event_id === evt.id || 
        (r.event_title && evt.title && r.event_title.toLowerCase().trim() === evt.title.toLowerCase().trim())
      );
      setRegistrations(matchingLocal);
    } finally {
      setRegsLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = ["Name", "Mobile", "Email", "Location", "From Address", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...registrations.map(r => 
        [r.name, r.mobile, r.email, r.location, r.from_address, r.status, new Date(r.registered_at).toLocaleString()].map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `registrations-${viewingEvent?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateRegistrationParticipation = async (regId: string, email: string | undefined, participated: boolean) => {
    const participatedAt = participated ? new Date().toISOString() : null;
    const newStatus = participated ? 'participated' : 'paid';

    try {
      if (regId && regId !== email && !regId.toString().startsWith('local_')) {
        await supabase.from('registrations').update({
          status: newStatus,
          certificate_issued: participated,
          participated_at: participatedAt
        }).eq('id', regId);
      }
    } catch (e) {
      console.warn('DB participation status update error:', e);
    }

    try {
      const past = JSON.parse(localStorage.getItem('ngo_saved_registrations') || '[]');
      const updatedPast = past.map((r: any) => {
        if (r.id === regId || (viewingEvent && r.event_id === viewingEvent.id && (r.email === email || r.id === regId))) {
          return { ...r, status: newStatus, certificate_issued: participated, participated_at: participatedAt };
        }
        return r;
      });
      localStorage.setItem('ngo_saved_registrations', JSON.stringify(updatedPast));
    } catch {}

    setRegistrations(prev => prev.map(r => {
      if (r.id === regId || (r.email && r.email === email)) {
        return { ...r, status: newStatus, certificate_issued: participated, participated_at: participatedAt };
      }
      return r;
    }));
    window.dispatchEvent(new Event('ngo_registration_updated'));
  };

  return (
    <div className="min-h-screen bg-black/5 flex flex-col md:flex-row font-['Lato']">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">Events & Campaigns</h1>
              <p className="text-zinc-500">Manage featured events and donation campaigns.</p>
            </div>
            <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-colors shrink-0">
              <Plus size={20} /> Add New Event
            </button>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/5 border-b border-black/5">
                      <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Event</th>
                      <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Date & Location</th>
                      <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Status</th>
                      <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-zinc-500">No events found. Create one to get started.</td>
                      </tr>
                    ) : (
                      events.map((evt) => (
                        <tr key={evt.id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-12 rounded-lg bg-black/5 overflow-hidden shrink-0 border border-black/10">
                                {evt.image_url && !evt.image_url.includes('/raw/upload/') && !evt.image_url.match(/\.pdf$/i) ? (
                                  <img src={evt.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-zinc-400"><ImageIcon size={16} /></div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-zinc-900 line-clamp-1">{evt.title}</p>
                                <p className="text-xs text-zinc-500 line-clamp-1 mt-1">{evt.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-zinc-800 font-medium">{evt.event_date ? new Date(evt.event_date).toLocaleDateString() : 'TBD'}</div>
                            <div className="text-xs text-zinc-500 mt-1 line-clamp-1">{evt.location}</div>
                            <div className="text-xs font-bold text-primary mt-1">{evt.is_free ? 'Free' : `₹${evt.price}`}</div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                              evt.status === 'upcoming' ? 'bg-primary/10 text-primary' : 'bg-zinc-100 text-zinc-500'
                            }`}>
                              {evt.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              {evt.show_register_button && (
                                <button onClick={() => openRegistrationsModal(evt)} className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors font-bold mr-2" title="View Registrations">
                                  <Users size={16} /> <span className="hidden xl:inline">Registrations</span>
                                </button>
                              )}
                              <button onClick={() => openEditModal(evt)} className="p-2 text-zinc-600 hover:bg-black/5 rounded-lg transition-colors" title="Edit">
                                <Edit2 size={18} />
                              </button>
                              <button onClick={() => handleDelete(evt.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-6 border-b flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-zinc-900 font-['Playfair_Display']">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-black/5 rounded-full text-zinc-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">Event Image</label>
                    <ImageUploader 
                      defaultImage={imageUrl} 
                      onUploadComplete={(url) => setImageUrl(url)} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">Certificate (PDF)</label>
                    <ImageUploader 
                      defaultImage={certificateTemplateUrl} 
                      onUploadComplete={(url) => setCertificateTemplateUrl(url)} 
                      acceptPDF={true}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Event Date</label>
                      <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Location</label>
                      <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Status</label>
                      <select value={status} onChange={e => setStatus(e.target.value as 'upcoming'|'completed')} required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none appearance-none bg-white">
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-center">
                      <label className="flex items-center gap-3 cursor-pointer mt-5">
                        <div className="relative">
                          <input type="checkbox" className="sr-only" checked={showRegisterButton} onChange={e => setShowRegisterButton(e.target.checked)} />
                          <div className={`block w-12 h-7 rounded-full transition-colors ${showRegisterButton ? 'bg-primary' : 'bg-zinc-300'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${showRegisterButton ? 'transform translate-x-5' : ''}`}></div>
                        </div>
                        <span className="text-sm font-bold text-zinc-700">Show Register Button</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col justify-center">
                      <label className="flex items-center gap-3 cursor-pointer mt-5">
                        <div className="relative">
                          <input type="checkbox" className="sr-only" checked={isFree} onChange={e => setIsFree(e.target.checked)} />
                          <div className={`block w-12 h-7 rounded-full transition-colors ${isFree ? 'bg-primary' : 'bg-zinc-300'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${isFree ? 'transform translate-x-5' : ''}`}></div>
                        </div>
                        <span className="text-sm font-bold text-zinc-700">Free Event</span>
                      </label>
                    </div>
                    {!isFree && (
                      <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">Price (₹)</label>
                        <input type="number" min="0" value={price} onChange={e => setPrice(Number(e.target.value))} required
                          className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold text-zinc-600 hover:bg-black/5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving || !imageUrl} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50">
                  {saving && <Loader2 className="animate-spin" size={20} />}
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* REGISTRATIONS MODAL */}
      {viewingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between shrink-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 font-['Playfair_Display']">
                  Registrations
                </h2>
                <p className="text-sm text-zinc-500 mt-1">{viewingEvent.title}</p>
              </div>
              <button onClick={() => setViewingEvent(null)} className="p-2 hover:bg-black/5 rounded-full text-zinc-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col p-8 overflow-hidden bg-zinc-50/50">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative w-full md:w-96">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input type="text" placeholder="Search by name, email, or mobile..." 
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none shadow-sm" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={downloadCSV} disabled={registrations.length === 0}
                    className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 text-sm">
                    <Download size={16} /> Export CSV
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto">
                  {regsLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-zinc-100 z-10 shadow-sm">
                        <tr>
                          <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Name</th>
                          <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Contact</th>
                          <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Location</th>
                          <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Status</th>
                          <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.filter(r => 
                          (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.mobile || '').includes(searchQuery)
                        ).length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-12 text-center text-zinc-500">
                              {registrations.length === 0 ? "No registrations yet." : "No matching registrations found."}
                            </td>
                          </tr>
                        ) : (
                          registrations.filter(r => 
                            (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (r.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (r.mobile || '').includes(searchQuery)
                          ).map((reg) => (
                            <tr key={reg.id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                              <td className="p-4">
                                <div className="font-bold text-zinc-900">{reg.name}</div>
                              </td>
                              <td className="p-4">
                                <div className="text-sm text-zinc-800">{reg.mobile}</div>
                                <div className="text-xs text-zinc-500">{reg.email}</div>
                              </td>
                              <td className="p-4">
                                <div className="text-sm text-zinc-800 line-clamp-1">{reg.location}</div>
                                <div className="text-xs text-zinc-500 line-clamp-1">{reg.from_address}</div>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col items-start gap-1">
                                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    reg.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                                    reg.status === 'pending_payment' ? 'bg-amber-100 text-amber-700' : 
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {reg.status === 'participated' ? 'paid' : reg.status}
                                  </span>
                                  {(reg.status === 'participated' || reg.certificate_issued) ? (
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                        🎓 Attended / Completed
                                      </span>
                                      <button
                                        onClick={() => updateRegistrationParticipation(reg.id, reg.email, false)}
                                        title="Revoke Attendance Status"
                                        className="text-[10px] text-zinc-400 hover:text-red-600 underline font-semibold"
                                      >
                                        Revoke
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-100 text-zinc-500 border border-zinc-200 font-bold uppercase tracking-wider flex items-center gap-1">
                                        ⏳ Registered Only
                                      </span>
                                      <button
                                        onClick={() => updateRegistrationParticipation(reg.id, reg.email, true)}
                                        title="Mark as Attended"
                                        className="text-[10px] text-primary hover:underline font-bold"
                                      >
                                        + Mark Attended
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 text-sm text-zinc-600">
                                {new Date(reg.registered_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
