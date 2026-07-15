import { useState } from 'react';
import { NavLink } from 'react-router';
import { 
  LayoutDashboard, FileText, List, Calendar, Image as ImageIcon, MessageSquare,
  Loader2, Mail, MailOpen, Phone, Clock, ChevronDown, ChevronUp
} from 'lucide-react';
import { useMessages } from '../../hooks/useMessages';

export default function AdminMessages() {
  const { messages, loading, markAsRead } = useMessages(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string, isRead: boolean) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!isRead) {
        markAsRead(id, true);
      }
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
            <NavLink key={link.path} to={link.path} className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-zinc-600 hover:bg-black/5 hover:text-zinc-900'}`
            }>
              {link.icon} {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">Contact Messages</h1>
            <p className="text-zinc-500">View and manage messages from the website contact form.</p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
              {messages.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
                  <MailOpen className="w-12 h-12 mb-4 text-zinc-300" />
                  <p>No contact messages found.</p>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`transition-colors ${!msg.is_read ? 'bg-primary/5' : 'hover:bg-black/[0.02]'}`}
                    >
                      <div 
                        className="p-4 sm:p-6 cursor-pointer flex items-start sm:items-center gap-4"
                        onClick={() => toggleExpand(msg.id, msg.is_read)}
                      >
                        <div className="shrink-0 mt-1 sm:mt-0">
                          {msg.is_read ? (
                            <MailOpen className="text-zinc-400" size={20} />
                          ) : (
                            <Mail className="text-primary" size={20} />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-bold truncate ${!msg.is_read ? 'text-zinc-900' : 'text-zinc-700'}`}>
                                {msg.name}
                              </span>
                              {!msg.is_read && (
                                <span className="bg-primary text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full shrink-0">
                                  New
                                </span>
                              )}
                            </div>
                            <div className={`text-sm line-clamp-1 ${!msg.is_read ? 'font-medium text-zinc-800' : 'text-zinc-500'}`}>
                              {msg.message}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 shrink-0 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                            {expandedId === msg.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded View */}
                      {expandedId === msg.id && (
                        <div className="px-4 sm:px-6 pb-6 pt-2 bg-black/[0.02] border-t border-black/5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="bg-white p-3 rounded-lg border border-black/5">
                              <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Email Address</div>
                              <a href={`mailto:${msg.email}`} className="text-primary hover:underline text-sm font-medium flex items-center gap-2">
                                <Mail size={14} /> {msg.email}
                              </a>
                            </div>
                            {msg.phone && (
                              <div className="bg-white p-3 rounded-lg border border-black/5">
                                <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Phone Number</div>
                                <a href={`tel:${msg.phone}`} className="text-primary hover:underline text-sm font-medium flex items-center gap-2">
                                  <Phone size={14} /> {msg.phone}
                                </a>
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-white p-5 rounded-xl border border-black/5">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-3">Full Message</div>
                            <p className="text-zinc-800 text-sm whitespace-pre-wrap leading-relaxed">
                              {msg.message}
                            </p>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(msg.id, !msg.is_read);
                              }}
                              className="text-xs font-bold text-zinc-500 hover:text-zinc-900 px-4 py-2 bg-white rounded-lg border border-black/5 hover:border-black/20 transition-all"
                            >
                              Mark as {msg.is_read ? 'Unread' : 'Read'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
