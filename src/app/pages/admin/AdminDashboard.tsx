import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router';
import { AdminSidebar } from '../../components/AdminSidebar';
import { supabaseAdmin as supabase } from '../../../lib/supabase';
import { 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  List, 
  Calendar, 
  Image as ImageIcon, 
  MessageSquare,
  Loader2,
  Mail,
  TrendingUp,
  DollarSign,
  Sparkles
} from 'lucide-react';
import { getSentEmails, getUnreadEmailCount } from '../../../lib/emailService';

export default function AdminDashboard() {
  const { user, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSuperAdmin) {
      navigate('/admin/ngo/events', { replace: true });
    }
  }, [isSuperAdmin, navigate]);

  const [counts, setCounts] = useState({
    events: 0,
    upcomingEvents: 0,
    gallery: 0,
    unreadMessages: 0,
    totalRegistrations: 0
  });
  const [analytics, setAnalytics] = useState({
    totalDonations: 0,
    donationsCount: 0,
    emailsSent: 0,
    unreadEmails: 0
  });
  const [eventBreakdown, setEventBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          { count: totalEvents },
          { count: upcomingEvents },
          { count: galleryImages },
          { count: unreadMessages },
          { count: totalRegistrations },
          { data: eventsData },
          { data: registrationsData }
        ] = await Promise.all([
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
          supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
          supabase.from('registrations').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('id, title').order('created_at', { ascending: false }),
          supabase.from('registrations').select('event_id')
        ]);

        const localRegs = JSON.parse(localStorage.getItem('ngo_saved_registrations') || '[]');
        const allRegs = [...(registrationsData || []), ...localRegs];
        const uniqueRegsMap = new Map();
        for (const item of allRegs) {
          const key = item.id || `${item.event_id}-${item.email}-${item.name}`;
          if (key && !uniqueRegsMap.has(key)) {
            uniqueRegsMap.set(key, item);
          }
        }
        const combinedRegs = Array.from(uniqueRegsMap.values());

        setCounts({
          events: totalEvents || 0,
          upcomingEvents: upcomingEvents || 0,
          gallery: galleryImages || 0,
          unreadMessages: unreadMessages || 0,
          totalRegistrations: Math.max(totalRegistrations || 0, combinedRegs.length)
        });

        if (eventsData) {
          const breakdown = eventsData.map(evt => {
            const count = combinedRegs.filter((r: any) => r.event_id === evt.id || (r.event_title && evt.title && r.event_title.toLowerCase().trim() === evt.title.toLowerCase().trim())).length;
            return { title: evt.title, count };
          });
          setEventBreakdown(breakdown);
        }

        let totalDons = 0;
        let donsCount = 0;
        try {
          const { data: dbDons } = await supabase.from('donations').select('id, amount, payment_id, cause, created_at');
          const localDons = JSON.parse(localStorage.getItem('ngo_saved_donations') || '[]');
          const allDons = [...(dbDons || []), ...localDons];
          const uniqueDonsMap = new Map();
          for (const item of allDons) {
            const key = item.payment_id || item.id || `${item.cause}-${item.amount}-${item.created_at}`;
            if (key && !uniqueDonsMap.has(key)) {
              uniqueDonsMap.set(key, item);
            }
          }
          const uniqueDons = Array.from(uniqueDonsMap.values());
          donsCount = uniqueDons.length;
          totalDons = uniqueDons.reduce((acc: number, cur: any) => acc + (Number(cur.amount) || 0), 0);
        } catch {
          const localDons = JSON.parse(localStorage.getItem('ngo_saved_donations') || '[]');
          donsCount = localDons.length;
          totalDons = localDons.reduce((acc: number, cur: any) => acc + (Number(cur.amount) || 0), 0);
        }

        const sentMails = getSentEmails();
        const unreadMails = getUnreadEmailCount();

        setAnalytics({
          totalDonations: totalDons,
          donationsCount: donsCount,
          emailsSent: sentMails.length,
          unreadEmails: unreadMails
        });
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-black/5 flex flex-col md:flex-row font-['Lato']">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">Welcome back!</h1>
            <p className="text-zinc-500">Signed in as {user?.email}</p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-primary border-y border-r border-black/5">
                  <h3 className="text-zinc-500 text-sm font-bold mb-2 uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar size={16} className="text-primary" /> Total Events
                  </h3>
                  <p className="text-4xl font-bold text-zinc-900">{counts.events}</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-teal-400 border-y border-r border-black/5">
                  <h3 className="text-zinc-500 text-sm font-bold mb-2 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles size={16} className="text-teal-500" /> Upcoming Events
                  </h3>
                  <p className="text-4xl font-bold text-zinc-900">{counts.upcomingEvents}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-emerald-500 border-y border-r border-black/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-zinc-500 text-sm font-bold mb-2 uppercase tracking-wide flex items-center gap-1.5">
                      <DollarSign size={16} className="text-emerald-500" /> Total Funds Raised (80G)
                    </h3>
                    <p className="text-4xl font-bold text-[#0F6E6E]">₹{analytics.totalDonations.toLocaleString('en-IN')}</p>
                    <span className="text-xs text-zinc-400 font-medium">{analytics.donationsCount} total contributions</span>
                  </div>
                  <button
                    onClick={() => navigate('/admin/ngo/donations')}
                    className="mt-4 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-2 px-3 rounded-xl transition-colors flex items-center justify-between w-full border border-emerald-200"
                  >
                    <span>View Donors & Ledger</span>
                    <span>➔</span>
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-indigo-500 border-y border-r border-black/5">
                  <h3 className="text-zinc-500 text-sm font-bold mb-2 uppercase tracking-wide flex items-center gap-1.5">
                    <TrendingUp size={16} className="text-indigo-500" /> Event Registrations
                  </h3>
                  <p className="text-4xl font-bold text-zinc-900">{counts.totalRegistrations}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-purple-500 border-y border-r border-black/5">
                  <h3 className="text-zinc-500 text-sm font-bold mb-2 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail size={16} className="text-purple-500" /> Gmail Notifications Sent
                  </h3>
                  <p className="text-4xl font-bold text-purple-700">{analytics.emailsSent}</p>
                  <span className="text-xs text-zinc-400 font-medium">Invoices, Receipts & Tickets</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-rose-500 border-y border-r border-black/5 relative overflow-hidden">
                  <h3 className="text-zinc-500 text-sm font-bold mb-2 uppercase tracking-wide flex items-center gap-1.5">
                    <MessageSquare size={16} className="text-rose-500" /> Unread Messages
                  </h3>
                  <p className="text-4xl font-bold text-zinc-900">{counts.unreadMessages}</p>
                  {counts.unreadMessages > 0 && (
                    <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          )}

          {!loading && eventBreakdown.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-zinc-900 mb-6 font-['Playfair_Display']">Registrations Per Event</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/5 border-b border-black/5">
                      <th className="py-4 px-6 font-bold text-sm text-zinc-600 uppercase tracking-wider">Event Name</th>
                      <th className="py-4 px-6 font-bold text-sm text-zinc-600 uppercase tracking-wider w-32 text-right">Registrations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventBreakdown.map((evt, idx) => (
                      <tr key={idx} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors">
                        <td className="py-4 px-6 font-medium text-zinc-900">{evt.title}</td>
                        <td className="py-4 px-6 font-bold text-primary text-right">{evt.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
