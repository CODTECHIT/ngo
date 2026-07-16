import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router';
import { 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  List, 
  Calendar, 
  Image as ImageIcon, 
  MessageSquare
} from 'lucide-react';

export default function AdminSiteContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            <h1 className="text-3xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">Site Content Management</h1>
            <p className="text-zinc-500">Manage the content displayed on the public website here.</p>
          </header>

          <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm text-center">
            <p className="text-zinc-500">Site content management features coming soon.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
