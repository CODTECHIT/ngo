import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router';
import { supabase } from '../../../lib/supabase';
import { 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  List, 
  Calendar, 
  Image as ImageIcon, 
  MessageSquare,
  Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    events: 0,
    upcomingEvents: 0,
    gallery: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          { count: totalEvents },
          { count: upcomingEvents },
          { count: galleryImages },
          { count: unreadMessages }
        ] = await Promise.all([
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
          supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false)
        ]);

        setCounts({
          events: totalEvents || 0,
          upcomingEvents: upcomingEvents || 0,
          gallery: galleryImages || 0,
          unreadMessages: unreadMessages || 0
        });
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
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
      {/* Sidebar */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-primary border-y border-r border-black/5">
                <h3 className="text-zinc-500 text-sm font-bold mb-2 uppercase tracking-wide">Total Events</h3>
                <p className="text-4xl font-bold text-zinc-900">{counts.events}</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-teal-400 border-y border-r border-black/5">
                <h3 className="text-zinc-500 text-sm font-bold mb-2 uppercase tracking-wide">Upcoming Events</h3>
                <p className="text-4xl font-bold text-zinc-900">{counts.upcomingEvents}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-emerald-500 border-y border-r border-black/5">
                <h3 className="text-zinc-500 text-sm font-bold mb-2 uppercase tracking-wide">Gallery Images</h3>
                <p className="text-4xl font-bold text-zinc-900">{counts.gallery}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-rose-500 border-y border-r border-black/5 relative overflow-hidden">
                <h3 className="text-zinc-500 text-sm font-bold mb-2 uppercase tracking-wide">Unread Messages</h3>
                <p className="text-4xl font-bold text-zinc-900">{counts.unreadMessages}</p>
                {counts.unreadMessages > 0 && (
                  <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
