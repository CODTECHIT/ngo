import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useEvents } from '../hooks/useEvents';
import { supabase } from '../../lib/supabase';
import { Megaphone, Calendar, CheckCircle2, Sparkles, Radio } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ngo_news_ticker_message';
const LOCAL_ANNOUNCEMENTS_KEY = 'ngo_ticker_announcements';

export function HeaderTicker() {
  const { events } = useEvents();
  const [adminMessage, setAdminMessage] = useState<string>('');
  const [announcements, setAnnouncements] = useState<{ id: string; message: string }[]>([]);
  const [enabled, setEnabled] = useState<boolean>(true);

  const loadAnnouncements = async () => {
    try {
      const { data } = await supabase
        .from('ticker_announcements')
        .select('id, message')
        .order('created_at', { ascending: false });
      if (Array.isArray(data) && data.length > 0) {
        setAnnouncements(data.map(a => ({ id: a.id, message: a.message })));
        return;
      }
    } catch (e) {}

    // LocalStorage fallback
    try {
      const local = localStorage.getItem(LOCAL_ANNOUNCEMENTS_KEY);
      if (local) setAnnouncements(JSON.parse(local));
    } catch (e) {}
  };

  const loadNewsMessage = async () => {
    try {
      const { data } = await supabase.from('site_content').select('news_ticker_message, news_ticker_enabled').eq('id', 1).maybeSingle();
      if (data && data.news_ticker_message !== undefined) {
        setAdminMessage(data.news_ticker_message || '');
        setEnabled(data.news_ticker_enabled !== false);
      } else {
        // LocalStorage fallback
        const localVal = localStorage.getItem(LOCAL_STORAGE_KEY);
        const localEnabled = localStorage.getItem('ngo_news_ticker_enabled');
        if (localVal !== null) setAdminMessage(localVal);
        if (localEnabled !== null) setEnabled(localEnabled !== 'false');
      }
    } catch (e) {}

    await loadAnnouncements();
  };

  useEffect(() => {
    loadNewsMessage();
    const handleUpdate = () => loadNewsMessage();
    window.addEventListener('ngo_news_ticker_updated', handleUpdate);
    return () => window.removeEventListener('ngo_news_ticker_updated', handleUpdate);
  }, []);

  if (!enabled) return null;

  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000; // 24 hours

  const upcomingAndOngoingEvents = events.filter(e => e.status !== 'completed');

  const recentCompletedEvents = events.filter(e => {
    if (e.status !== 'completed') return false;
    if (!e.event_date) return false;
    const evtTime = new Date(e.event_date).getTime();
    const diff = now - evtTime;
    return diff >= 0 && diff <= oneDayMs;
  }).slice(0, 1);

  const tickerItems: { id: string; badge: string; text: string; icon: any; color: string }[] = [];

  // Add Admin Message
  if (adminMessage.trim()) {
    tickerItems.push({
      id: 'admin_news',
      badge: 'NEWS',
      text: adminMessage,
      icon: <Megaphone size={13} className="text-amber-300 shrink-0" />,
      color: 'bg-amber-500/20 text-amber-300 border-amber-400/30'
    });
  }

  // Add Multiple Announcements
  announcements.forEach((a) => {
    tickerItems.push({
      id: `ann_${a.id}`,
      badge: 'NEWS',
      text: a.message,
      icon: <Megaphone size={13} className="text-amber-300 shrink-0" />,
      color: 'bg-amber-500/20 text-amber-300 border-amber-400/30'
    });
  });

  // Add Upcoming / Ongoing Events
  upcomingAndOngoingEvents.forEach(evt => {
    const formattedDate = evt.event_date ? new Date(evt.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Soon';
    tickerItems.push({
      id: `evt_${evt.id}`,
      badge: evt.status === 'upcoming' ? 'UPCOMING EVENT' : 'ONGOING EVENT',
      text: `${evt.title} (${formattedDate}${evt.location ? ` @ ${evt.location}` : ''})`,
      icon: evt.status === 'upcoming' ? <Calendar size={13} className="text-teal-300 shrink-0" /> : <Sparkles size={13} className="text-orange-300 shrink-0" />,
      color: evt.status === 'upcoming' ? 'bg-teal-500/20 text-teal-300 border-teal-400/30' : 'bg-orange-500/20 text-orange-300 border-orange-400/30'
    });
  });

  // Add Recent Completed Events (Within 24h)
  recentCompletedEvents.forEach(evt => {
    tickerItems.push({
      id: `completed_${evt.id}`,
      badge: 'COMPLETED EVENT',
      text: `${evt.title} completed successfully! Thank you for participating.`,
      icon: <CheckCircle2 size={13} className="text-emerald-300 shrink-0" />,
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
    });
  });

  if (tickerItems.length === 0) return null;

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-zinc-950 via-teal-950 to-zinc-950 text-white border-b border-teal-900/40 text-xs py-2 shadow-md select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        {/* Left Glowing Live Badge */}
        <div className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-zinc-950 font-black px-3 py-1 rounded-full uppercase text-[10px] tracking-wider shadow-[0_0_12px_rgba(20,184,166,0.5)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-950"></span>
          </span>
          <span>LIVE NEWS</span>
        </div>

        {/* Scrolling Marquee Container */}
        <div className="flex-1 overflow-hidden relative">
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="5"
            onMouseOver={(e) => (e.currentTarget as any).stop()}
            onMouseOut={(e) => (e.currentTarget as any).start()}
            className="flex items-center"
          >
            <div className="inline-flex items-center gap-8 py-0.5">
              {tickerItems.map((item, idx) => (
                <Link
                  key={item.id + '_' + idx}
                  to={item.id.startsWith('evt_') || item.id.startsWith('completed_') ? '/events' : '/news'}
                  className="inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                  title={item.id.startsWith('evt_') || item.id.startsWith('completed_') ? 'View this event on the Events page' : 'Read more on the News page'}
                >
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${item.color}`}>
                    {item.icon}
                    <span>{item.badge}</span>
                  </span>
                  <span className="font-medium text-zinc-100 tracking-wide text-xs">{item.text}</span>
                  <span className="text-teal-500/60 font-bold ml-4">✦</span>
                </Link>
              ))}
            </div>
          </marquee>
        </div>
      </div>
    </div>
  );
}
