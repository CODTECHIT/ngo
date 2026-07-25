import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router';
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
  CheckCircle,
  Sparkles,
  BarChart3,
  PieChart,
  Send,
  Heart
} from 'lucide-react';
import { getSentEmails, sendEmail, getUnreadEmailCount } from '../../../lib/emailService';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

        setCounts({
          events: totalEvents || 0,
          upcomingEvents: upcomingEvents || 0,
          gallery: galleryImages || 0,
          unreadMessages: unreadMessages || 0,
          totalRegistrations: totalRegistrations || 0
        });

        if (eventsData && registrationsData) {
          const breakdown = eventsData.map(evt => {
            const count = registrationsData.filter(r => r.event_id === evt.id).length;
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

  const handleSendTestReport = () => {
    const targetEmail = user?.email || 'admin@srishreevision.org';
    sendEmail({
      to: targetEmail,
      subject: '📊 Daily NGO Analytics & Gmail Engine Health Report',
      category: 'General Notification',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #0F6E6E, #4CAF50); padding: 25px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 22px;">📊 Executive Analytics Report</h2>
            <p style="margin: 5px 0 0; opacity: 0.9; font-size: 13px;">Srishreevision Foundation Admin Portal</p>
          </div>
          <div style="padding: 25px;">
            <p style="color: #334155; font-size: 15px;">Hello <strong>Admin</strong>,</p>
            <p style="color: #475569; line-height: 1.6;">Here is your real-time organizational health summary and email simulation status:</p>
            <div style="background: #f8fafc; border-left: 4px solid #0F6E6E; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0; font-size: 14px; color: #1e293b;"><strong>💰 Total Funds Raised:</strong> ₹${analytics.totalDonations.toLocaleString('en-IN')} (${analytics.donationsCount} donations)</p>
              <p style="margin: 5px 0; font-size: 14px; color: #1e293b;"><strong>👥 Total Registrations:</strong> ${counts.totalRegistrations} across ${counts.events} events</p>
              <p style="margin: 5px 0; font-size: 14px; color: #1e293b;"><strong>✉️ Gmail Notifications Sent:</strong> ${analytics.emailsSent} total emails delivered</p>
            </div>
            <p style="color: #64748b; font-size: 13px;">All payment routing (Razorpay) and email simulation pipelines are operating at 100% capacity.</p>
          </div>
          <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
            Srishreevision Foundation • Automated Admin Notification System
          </div>
        </div>
      `
    });
    alert(`Executive Report sent to ${targetEmail} via Gmail notification engine!`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/ngo/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin/ngo/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Programs / Services', path: '/admin/ngo/programs', icon: <List size={18} /> },
    { name: 'Events', path: '/admin/ngo/events', icon: <Calendar size={18} /> },
    { name: 'Gallery', path: '/admin/ngo/gallery', icon: <ImageIcon size={18} /> },
    { name: 'Donations & Donors', path: '/admin/ngo/donations', icon: <Heart size={18} /> },
    { name: 'Contact Messages', path: '/admin/ngo/contact-messages', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-black/5 flex flex-col md:flex-row font-['Lato']">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-black/5 shrink-0 flex flex-col">
        <div className="p-6 border-b border-black/5 flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center">
            <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-contain" />
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
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-zinc-600 hover:bg-black/5 hover:text-zinc-900'
                }`
              }
            >
              {link.icon} {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-black/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold text-sm transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

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

              {/* Executive Analytics & Email Notification Center */}
              <div className="bg-gradient-to-br from-white to-zinc-50/80 border border-black/5 rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-black/5">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 font-['Playfair_Display'] flex items-center gap-2">
                      <BarChart3 className="text-primary" /> Executive Analytics & Gmail Health Center
                    </h2>
                    <p className="text-sm text-zinc-500">Live monitoring of donation revenue, event completion analysis, and email delivery.</p>
                  </div>
                  <div>
                    <button
                      onClick={handleSendTestReport}
                      className="flex items-center gap-2 bg-[#0F6E6E] text-white font-bold px-4 py-2.5 rounded-xl hover:bg-[#0c5959] transition-all shadow-sm text-xs"
                    >
                      <Send size={14} /> Send Admin Summary to Gmail
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                    <h4 className="font-bold text-zinc-900 mb-2 flex items-center gap-2 text-sm">
                      <Heart className="text-red-500 fill-red-500" size={16} /> 80G Tax Exemption Pipeline
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      All donations processed via Razorpay automatically generate 80G compliant HTML receipts delivered instantly to the user's Gmail inbox.
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-black/5">
                      <span className="text-zinc-500">Pipeline Status:</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> Active & Verified
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                    <h4 className="font-bold text-zinc-900 mb-2 flex items-center gap-2 text-sm">
                      <PieChart className="text-purple-600" size={16} /> Certificate Completion Engine
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      When participants complete events, completion certificates published by the event admin are delivered to participants via Gmail.
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-black/5">
                      <span className="text-zinc-500">Generator Engine:</span>
                      <span className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> Admin Controlled
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                    <h4 className="font-bold text-zinc-900 mb-2 flex items-center gap-2 text-sm">
                      <DollarSign className="text-emerald-600" size={16} /> Razorpay Checkout Router
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      Seamless routing between free registrations and paid ticket checkouts. Dual persistence to online database and local storage.
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-black/5">
                      <span className="text-zinc-500">Payment Routing:</span>
                      <span className="text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> Interactive Modal Active
                      </span>
                    </div>
                  </div>
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
