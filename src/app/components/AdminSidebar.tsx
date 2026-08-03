import { NavLink } from 'react-router';
import { useEffect } from 'react';
import { 
  LayoutDashboard, List, Calendar, Image as ImageIcon, Heart, 
  MessageSquare, Users, Shield, LogOut, Megaphone, ClipboardList, Newspaper, Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../hooks/useApplications';

export function AdminSidebar() {
  const { isSuperAdmin, isEventManager, role, logout } = useAuth();
  const { unreadCount, refetch } = useApplications();

  useEffect(() => {
    const handler = () => refetch();
    window.addEventListener('ngo_applications_updated', handler);
    return () => window.removeEventListener('ngo_applications_updated', handler);
  }, [refetch]);

  const allLinks = [
    { name: 'Dashboard', path: '/admin/ngo/dashboard', icon: <LayoutDashboard size={18} />, requireSuper: true },
    { name: 'Programs / Services', path: '/admin/ngo/programs', icon: <List size={18} />, requireSuper: false },
    { name: 'Events', path: '/admin/ngo/events', icon: <Calendar size={18} />, requireSuper: false },
    { name: 'News Articles', path: '/admin/ngo/news', icon: <Newspaper size={18} />, requireSuper: false },
    { name: 'Header News Ticker', path: '/admin/ngo/news/ticker', icon: <Megaphone size={18} />, requireSuper: false },
    { name: 'Gallery', path: '/admin/ngo/gallery', icon: <ImageIcon size={18} />, requireSuper: false },
    { name: 'Donations & Donors', path: '/admin/ngo/donations', icon: <Heart size={18} />, requireSuper: true },
    { name: 'Pledge Certificates', path: '/admin/ngo/pledges', icon: <Award size={18} />, requireSuper: false },
    { name: 'Applications', path: '/admin/ngo/applications', icon: <ClipboardList size={18} />, requireSuper: false, badge: unreadCount },

    { name: 'Contact Messages', path: '/admin/ngo/contact-messages', icon: <MessageSquare size={18} />, requireSuper: false },
    { name: 'Team Roles (RBAC)', path: '/admin/ngo/team-roles', icon: <Users size={18} />, requireSuper: true },
  ];

  const visibleLinks = allLinks.filter(link => {
    if (link.requireSuper && !isSuperAdmin) {
      return false;
    }
    return true;
  });

  return (
    <aside className="w-full md:w-64 bg-white border-r border-black/5 shrink-0 flex flex-col min-h-screen">
      <div className="p-6 border-b border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center">
            <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-zinc-900 block">ADMIN PORTAL</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary mt-1 inline-flex items-center gap-1">
              <Shield size={10} />
              {isSuperAdmin ? 'Super Admin' : isEventManager ? 'Event Manager' : role || 'Staff'}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex md:flex-col gap-1 p-4 overflow-x-auto md:overflow-x-visible md:flex-1">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all shrink-0 md:w-full ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-zinc-600 hover:bg-black/5 hover:text-zinc-900'
              }`
            }
          >
            {link.icon}
            <span className="flex-1">{link.name}</span>
            {(link.badge ?? 0) > 0 && (
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 blink-dot" />
                <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full">
                  {link.badge}
                </span>
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-black/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
