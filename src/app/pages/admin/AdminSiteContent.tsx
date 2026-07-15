import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { useSiteContent, SiteContent } from '../../hooks/useSiteContent';
import { ImageUploader } from '../../components/ImageUploader';
import { Loader2, Save, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { NavLink } from 'react-router';
import { LayoutDashboard, FileText, List, Calendar, Image as ImageIcon, MessageSquare } from 'lucide-react';

export default function AdminSiteContent() {
  const { originalData, loading: dataLoading } = useSiteContent();
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Initialize form state
  const [form, setForm] = useState<SiteContent>({
    id: 1,
    hero_heading: '',
    hero_subheading: '',
    stats: [],
    about_text: '',
    mission_text: '',
    vision_text: '',
    director_name: '',
    director_quote: '',
    director_photo_url: '',
    contact_phone: '',
    contact_email: '',
    contact_address: ''
  });

  // Load fetched data into form
  useEffect(() => {
    if (originalData) {
      setForm(originalData);
    } else if (!dataLoading) {
      // If it doesn't exist yet in the DB, init empty stats
      setForm(prev => ({ ...prev, stats: [{ number: '', label: '' }] }));
    }
  }, [originalData, dataLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStatChange = (index: number, field: 'number' | 'label', value: string) => {
    const newStats = [...form.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setForm(prev => ({ ...prev, stats: newStats }));
  };

  const addStat = () => {
    if (form.stats.length < 4) {
      setForm(prev => ({ ...prev, stats: [...prev.stats, { number: '', label: '' }] }));
    }
  };

  const removeStat = (index: number) => {
    setForm(prev => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setShowSuccess(false);
    
    try {
      const { error } = await supabase.from('site_content').upsert({
        ...form,
        id: 1,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Force reload the page to refresh caches if needed, or window location reload
      // But standard SPA is fine since we cache in the hook. To bust cache:
      window.location.reload(); 
    } catch (err) {
      console.error("Error saving content:", err);
      alert("Failed to save content. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Site Content', path: '/admin/site-content', icon: <FileText size={18} /> },
    { name: 'Programs', path: '/admin/programs', icon: <List size={18} /> },
    { name: 'Events', path: '/admin/events', icon: <Calendar size={18} /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <ImageIcon size={18} /> },
    { name: 'Contact Messages', path: '/admin/contact-messages', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-black/5 flex flex-col md:flex-row font-['Lato']">
      <aside className="w-full md:w-64 bg-white border-r border-black/5 shrink-0 flex flex-col">
        <div className="p-6 border-b border-black/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-black/5 flex items-center justify-center shadow-sm">
            <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover scale-[1.35]" />
          </div>
          <span className="font-bold text-sm tracking-tight text-zinc-900">ADMIN PORTAL</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-zinc-600 hover:bg-black/5 hover:text-zinc-900'
                }`
              }
            >
              {link.icon} {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">Site Content</h1>
              <p className="text-zinc-500">Manage the text and images on your public homepage and about pages.</p>
            </div>
            {showSuccess && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={20} /> Saved successfully
              </div>
            )}
          </header>

          {dataLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-black/5">
              
              {/* HERO SECTION */}
              <div>
                <h2 className="text-xl font-bold text-zinc-900 mb-4 border-b pb-2">Hero Section</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Heading</label>
                    <input type="text" name="hero_heading" value={form.hero_heading} onChange={handleChange} required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Subheading</label>
                    <textarea name="hero_subheading" value={form.hero_subheading} onChange={handleChange} rows={3} required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none" />
                  </div>
                </div>
              </div>

              {/* STATS SECTION */}
              <div>
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h2 className="text-xl font-bold text-zinc-900">Statistics (Max 4)</h2>
                  {form.stats.length < 4 && (
                    <button type="button" onClick={addStat} className="flex items-center gap-1 text-sm text-primary font-bold hover:opacity-80">
                      <Plus size={16} /> Add Stat
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.stats.map((stat, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                      <div className="flex-1 space-y-2">
                        <input type="text" placeholder="Number (e.g. 50,000+)" value={stat.number} onChange={(e) => handleStatChange(idx, 'number', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-300 outline-none focus:border-primary text-sm font-bold" />
                        <input type="text" placeholder="Label (e.g. Lives Impacted)" value={stat.label} onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-300 outline-none focus:border-primary text-sm" />
                      </div>
                      <button type="button" onClick={() => removeStat(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ABOUT SECTION */}
              <div>
                <h2 className="text-xl font-bold text-zinc-900 mb-4 border-b pb-2">About & Mission</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">About Text</label>
                    <textarea name="about_text" value={form.about_text} onChange={handleChange} rows={4} required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Mission Text</label>
                      <textarea name="mission_text" value={form.mission_text} onChange={handleChange} rows={3} required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Vision Text</label>
                      <textarea name="vision_text" value={form.vision_text} onChange={handleChange} rows={3} required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none resize-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* DIRECTOR SECTION */}
              <div>
                <h2 className="text-xl font-bold text-zinc-900 mb-4 border-b pb-2">Director's Message</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-zinc-700 mb-2">Director Photo</label>
                    <ImageUploader 
                      defaultImage={form.director_photo_url} 
                      onUploadComplete={(url) => setForm(prev => ({ ...prev, director_photo_url: url }))} 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Director Name</label>
                      <input type="text" name="director_name" value={form.director_name} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Director Quote</label>
                      <textarea name="director_quote" value={form.director_quote} onChange={handleChange} rows={3} required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none resize-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTACT SECTION */}
              <div>
                <h2 className="text-xl font-bold text-zinc-900 mb-4 border-b pb-2">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Phone Number</label>
                    <input type="text" name="contact_phone" value={form.contact_phone} onChange={handleChange} required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Email Address</label>
                    <input type="email" name="contact_email" value={form.contact_email} onChange={handleChange} required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Physical Address</label>
                    <textarea name="contact_address" value={form.contact_address} onChange={handleChange} rows={2} required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none resize-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50">
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
