import { useState, useEffect, useCallback } from 'react';
import { supabaseAdmin as supabase } from '../../../lib/supabase';
import { AdminSidebar } from '../../components/AdminSidebar';
import { Megaphone, Save, CheckCircle2, Loader2, AlertCircle, Plus, Trash2, ListChecks } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ngo_news_ticker_message';
const LOCAL_ANNOUNCEMENTS_KEY = 'ngo_ticker_announcements';

interface Announcement {
  id: string;
  message: string;
  created_at?: string;
}

export default function AdminNewsTicker() {
  const [message, setMessage] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const loadAnnouncements = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('ticker_announcements')
        .select('id, message, created_at')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        setAnnouncements(data.map(a => ({ id: a.id, message: a.message, created_at: a.created_at })));
        return;
      }
      throw error || new Error('empty');
    } catch (e) {
      // Fallback to localStorage
      try {
        const local = localStorage.getItem(LOCAL_ANNOUNCEMENTS_KEY);
        if (local) setAnnouncements(JSON.parse(local));
      } catch (_) { }
    }
  }, []);

  useEffect(() => {
    async function loadNewsMessage() {
      try {
        setLoading(true);
        // Try reading from DB site_content table
        const { data } = await supabase.from('site_content').select('news_ticker_message, news_ticker_enabled').eq('id', 1).maybeSingle();
        if (data && data.news_ticker_message !== undefined) {
          setMessage(data.news_ticker_message || '');
          setEnabled(data.news_ticker_enabled !== false);
        } else {
          // LocalStorage fallback
          const localVal = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localVal !== null) {
            setMessage(localVal);
          } else {
            setMessage('Welcome to NGO Organization! Check out our upcoming events below.');
          }
        }
      } catch (e) {
        console.warn("Could not load news message from database, checking local storage:", e);
        const localVal = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localVal !== null) setMessage(localVal);
      }
      await loadAnnouncements();
      setLoading(false);
    }
    loadNewsMessage();
  }, [loadAnnouncements]);

  const notifyTicker = () => {
    window.dispatchEvent(new Event('ngo_news_ticker_updated'));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      // 1. Try DB update
      await supabase.from('site_content').upsert({
        id: 1,
        news_ticker_message: message,
        news_ticker_enabled: enabled,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn("DB save failed, using local storage fallback:", e);
    }

    // 2. Always update local storage for instant sync across tabs
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, message);
      localStorage.setItem('ngo_news_ticker_enabled', String(enabled));
    } catch (e) { }

    notifyTicker();
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newAnnouncement.trim();
    if (!text) return;

    setAdding(true);
    setError('');

    const tempId = `temp_${Date.now()}`;
    const optimistic: Announcement = { id: tempId, message: text, created_at: new Date().toISOString() };
    setAnnouncements(prev => [optimistic, ...prev]);
    setNewAnnouncement('');

    try {
      const { data, error } = await supabase
        .from('ticker_announcements')
        .insert({ message: text })
        .select('id, message, created_at')
        .single();
      if (error) throw error;
      if (data) {
        setAnnouncements(prev => prev.map(a => (a.id === tempId ? { id: data.id, message: data.message, created_at: data.created_at } : a)));
      }
    } catch (err) {
      // DB failed   keep it in localStorage list
      try {
        const local = JSON.parse(localStorage.getItem(LOCAL_ANNOUNCEMENTS_KEY) || '[]');
        local.unshift({ id: tempId, message: text, created_at: new Date().toISOString() });
        localStorage.setItem(LOCAL_ANNOUNCEMENTS_KEY, JSON.stringify(local));
      } catch (_) { }
    }

    notifyTicker();
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError('');

    const removed = announcements.find(a => a.id === id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));

    try {
      if (id.startsWith('temp_')) {
        // only existed in localStorage
        const local = JSON.parse(localStorage.getItem(LOCAL_ANNOUNCEMENTS_KEY) || '[]').filter((a: Announcement) => a.id !== id);
        localStorage.setItem(LOCAL_ANNOUNCEMENTS_KEY, JSON.stringify(local));
      } else {
        const { error } = await supabase.from('ticker_announcements').delete().eq('id', id);
        if (error) throw error;
        const local = JSON.parse(localStorage.getItem(LOCAL_ANNOUNCEMENTS_KEY) || '[]').filter((a: Announcement) => a.id !== id);
        localStorage.setItem(LOCAL_ANNOUNCEMENTS_KEY, JSON.stringify(local));
      }
    } catch (err) {
      // Re-add if delete failed
      if (removed) setAnnouncements(prev => [removed, ...prev]);
      setError('Could not delete announcement. Please try again.');
    }

    notifyTicker();
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-black/5 flex flex-col md:flex-row font-['Lato']">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
              <Megaphone size={18} />
              <span>Header Announcements</span>
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">News</h1>
            <p className="text-zinc-600 text-base">
              Add one or more headline announcement sentences to display in the live scrolling header marquee ticker on every page of your website.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-8">
              {success && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                  <span className="font-bold text-sm">News marquee message saved and published live to header!</span>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-600 shrink-0" />
                  <span className="font-bold text-sm">{error}</span>
                </div>
              )}

              {/* Single headline message */}
              <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-8 md:p-10">
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-800 mb-2">
                      Primary Header News Message / Sentence
                    </label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={3}
                      placeholder="Type your main news announcement message here... (e.g. Free Eye Check-up Camp announced for August 15th at Alwal Community Center!)"
                      className="w-full px-5 py-4 rounded-2xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none text-zinc-900 font-medium text-base resize-none shadow-sm"
                    />
                    <p className="text-xs text-zinc-500 mt-2">
                      This message will scroll at the very top of every public page alongside your upcoming, ongoing and completed events (last 24h).
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                    <input
                      type="checkbox"
                      id="enableTicker"
                      checked={enabled}
                      onChange={e => setEnabled(e.target.checked)}
                      className="w-5 h-5 accent-primary rounded cursor-pointer"
                    />
                    <label htmlFor="enableTicker" className="text-sm font-bold text-zinc-800 cursor-pointer">
                      Enable Top Header News Marquee Banner
                    </label>
                  </div>

                  <div className="p-6 rounded-2xl bg-zinc-900 text-white space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent/80 block">Live Preview</span>
                    <div className="flex items-center gap-3 overflow-hidden text-sm">
                      <span className="px-2.5 py-0.5 rounded bg-accent text-zinc-950 font-black text-xs shrink-0">NEWS</span>
                      <span className="truncate text-zinc-200">{message || 'Your custom message will appear here...'}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      Save News Banner
                    </button>
                  </div>
                </form>
              </div>

              {/* Multiple announcements manager */}
              <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-8 md:p-10">
                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                  <ListChecks size={18} />
                  <span>Announcement List</span>
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">Multiple Announcements</h2>
                <p className="text-zinc-600 text-base mb-6">
                  Add as many news announcements as you like. Each one scrolls in the header ticker. You can delete any announcement at any time.
                </p>

                {/* Add form */}
                <form onSubmit={handleAdd} className="space-y-3 mb-6">
                  <label className="block text-sm font-bold text-zinc-800">
                    Add a New Announcement
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newAnnouncement}
                      onChange={e => setNewAnnouncement(e.target.value)}
                      placeholder="e.g. Blood Donation Camp this Sunday at Nampally Exhibition Grounds!"
                      className="flex-1 px-5 py-3.5 rounded-2xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none text-zinc-900 font-medium text-sm shadow-sm"
                    />
                    <button
                      type="submit"
                      disabled={adding || !newAnnouncement.trim()}
                      className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 shrink-0"
                    >
                      {adding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                      Add Announcement
                    </button>
                  </div>
                </form>

                {/* List */}
                {announcements.length === 0 ? (
                  <div className="p-10 text-center rounded-2xl border-2 border-dashed border-zinc-200">
                    <Megaphone size={28} className="mx-auto text-zinc-300 mb-3" />
                    <p className="text-zinc-500 text-sm font-medium">No announcements yet. Add one above to see it in the header ticker.</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {announcements.map((a) => (
                      <li key={a.id} className="flex items-start gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border bg-amber-500/20 text-amber-600 border-amber-400/30 shrink-0 mt-0.5">
                          NEWS
                        </span>
                        <p className="flex-1 text-sm font-medium text-zinc-800 leading-relaxed">{a.message}</p>
                        <button
                          type="button"
                          onClick={() => handleDelete(a.id)}
                          disabled={deletingId === a.id}
                          title="Delete announcement"
                          className="flex items-center gap-1.5 text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl font-bold text-xs transition-colors disabled:opacity-50 shrink-0"
                        >
                          {deletingId === a.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
