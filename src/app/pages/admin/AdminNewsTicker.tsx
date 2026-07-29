import { useState, useEffect } from 'react';
import { supabaseAdmin as supabase } from '../../../lib/supabase';
import { AdminSidebar } from '../../components/AdminSidebar';
import { Megaphone, Save, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ngo_news_ticker_message';

export default function AdminNewsTicker() {
  const [message, setMessage] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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
      } finally {
        setLoading(false);
      }
    }
    loadNewsMessage();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

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
    } catch (e) {}

    window.dispatchEvent(new Event('ngo_news_ticker_updated'));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
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
              Add a headline message sentence to display in the live scrolling header marquee ticker on every page of your website.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-8 md:p-10">
              {success && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                  <span className="font-bold text-sm">News marquee message saved and published live to header!</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-800 mb-2">
                    Header News Message / Sentence
                  </label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Type your news announcement message here... (e.g. Free Eye Check-up Camp announced for August 15th at Alwal Community Center!)"
                    className="w-full px-5 py-4 rounded-2xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none text-zinc-900 font-medium text-base resize-none shadow-sm"
                  />
                  <p className="text-xs text-zinc-500 mt-2">
                    This message will scroll at the very top of every public page alongside your upcoming, ongoing, and completed events (last 24h).
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

                {/* Preview Box */}
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
          )}
        </div>
      </main>
    </div>
  );
}
