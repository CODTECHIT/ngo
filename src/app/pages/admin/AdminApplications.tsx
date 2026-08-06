import { useState } from 'react';
import { 
  Loader2, Mail, Phone, MapPin, Clock, ChevronDown, ChevronUp, Download,
  Users, Building2, GraduationCap, HandCoins, Handshake, ClipboardList, Tag
} from 'lucide-react';
import { useApplications } from '../../hooks/useApplications';
import { AdminSidebar } from '../../components/AdminSidebar';

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; classes: string }> = {
  volunteer: { label: "Volunteer", icon: Users, classes: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  csr: { label: "Corporate CSR", icon: Building2, classes: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
  intern: { label: "Intern", icon: GraduationCap, classes: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  fundraise: { label: "Fundraise", icon: HandCoins, classes: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  partner: { label: "Partner NGOs", icon: Handshake, classes: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
};

const STATUS_META: Record<string, { label: string; classes: string }> = {
  pending: { label: "Pending", classes: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  approved: { label: "Approved", classes: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  rejected: { label: "Rejected", classes: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export default function AdminApplications() {
  const { applications, loading, markAsRead, updateStatus, unreadCount } = useApplications(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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

  const handleExportCSV = () => {
    const escape = (val: any) => {
      const s = (val === null || val === undefined) ? '' : String(val);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const columns = [
      'Full Name', 'Email', 'Phone', 'Category', 'Service', 'City',
      'Message', 'Status', 'Read', 'Submitted On'
    ];

    const rows = applications.map(a => [
      escape(a.full_name),
      escape(a.email),
      escape(a.phone),
      escape((CATEGORY_META[a.category] || {}).label || a.category),
      escape(a.service),
      escape(a.city),
      escape(a.message),
      escape(a.status || 'pending'),
      a.is_read ? 'Yes' : 'No',
      escape(a.created_at ? new Date(a.created_at).toLocaleString('en-IN') : '')
    ]);

    const csv = [columns.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `applications_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filtered = categoryFilter === 'all'
    ? applications
    : applications.filter(a => a.category === categoryFilter);

  return (
    <div className="min-h-screen bg-black/5 flex flex-col md:flex-row font-['Lato']">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">Applications</h1>
              <p className="text-zinc-500">Volunteer, CSR, Intern, Fundraise & NGO partnership applications.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:opacity-90 transition-all flex items-center gap-2 active:scale-95"
                title="Download all applications as CSV"
              >
                <Download size={16} /> Export CSV
              </button>
              {unreadCount > 0 && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 blink-dot" />
                  {unreadCount} unread
                </span>
              )}
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white border border-black/10 text-sm font-medium text-zinc-700 outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="all" className="bg-white text-zinc-700">All categories</option>
                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                  <option key={key} value={key} className="bg-white text-zinc-700">{meta.label}</option>
                ))}
              </select>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
              {filtered.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
                  <ClipboardList className="w-12 h-12 mb-4 text-zinc-300" />
                  <p>No applications found.</p>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {filtered.map((app) => {
                    const catMeta = CATEGORY_META[app.category] || { label: app.category, icon: ClipboardList, classes: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20" };
                    const CatIcon = catMeta.icon;
                    const stMeta = STATUS_META[app.status] || { label: app.status, classes: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20" };
                    return (
                      <div
                        key={app.id}
                        className={`transition-colors ${!app.is_read ? 'bg-primary/5' : 'hover:bg-black/[0.02]'}`}
                      >
                        <div
                          className="p-4 sm:p-6 cursor-pointer flex items-start gap-4"
                          onClick={() => toggleExpand(app.id, app.is_read)}
                        >
                          <div className="shrink-0 mt-1">
                            {!app.is_read && (
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 blink-dot block" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`font-bold truncate ${!app.is_read ? 'text-zinc-900' : 'text-zinc-700'}`}>
                                {app.full_name}
                              </span>
                              <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${catMeta.classes}`}>
                                <CatIcon size={10} />
                                {catMeta.label}
                              </span>
                              <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${stMeta.classes}`}>
                                {stMeta.label}
                              </span>
                              {!app.is_read && (
                                <span className="bg-primary text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full shrink-0">
                                  New
                                </span>
                              )}
                            </div>
                            <div className={`text-sm line-clamp-1 flex items-center gap-1.5 ${!app.is_read ? 'font-medium text-zinc-800' : 'text-zinc-500'}`}>
                              <Tag size={12} className="shrink-0" />
                              {app.service}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(app.created_at).toLocaleDateString()}
                            </span>
                            {expandedId === app.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>

                        {/* Expanded View */}
                        {expandedId === app.id && (
                          <div className="px-4 sm:px-6 pb-6 pt-2 bg-black/[0.02] border-t border-black/5">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                              <div className="bg-white p-3 rounded-lg border border-black/5">
                                <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Email Address</div>
                                <a href={`mailto:${app.email}`} className="text-primary hover:underline text-sm font-medium flex items-center gap-2 break-all">
                                  <Mail size={14} className="shrink-0" /> {app.email}
                                </a>
                              </div>
                              {app.phone && (
                                <div className="bg-white p-3 rounded-lg border border-black/5">
                                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Phone Number</div>
                                  <a href={`tel:${app.phone}`} className="text-primary hover:underline text-sm font-medium flex items-center gap-2">
                                    <Phone size={14} /> {app.phone}
                                  </a>
                                </div>
                              )}
                              {app.city && (
                                <div className="bg-white p-3 rounded-lg border border-black/5">
                                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">City</div>
                                  <div className="text-sm font-medium text-zinc-800 flex items-center gap-2">
                                    <MapPin size={14} /> {app.city}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-black/5 mb-4">
                              <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-3">Service Requested</div>
                              <p className="text-zinc-800 text-sm font-medium leading-relaxed">{app.service}</p>
                            </div>

                            {app.message && (
                              <div className="bg-white p-5 rounded-xl border border-black/5">
                                <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-3">Message</div>
                                <p className="text-zinc-800 text-sm whitespace-pre-wrap leading-relaxed">{app.message}</p>
                              </div>
                            )}

                            <div className="mt-4 flex flex-wrap justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(app.id, !app.is_read);
                                }}
                                className="text-xs font-bold text-zinc-500 hover:text-zinc-900 px-4 py-2 bg-white rounded-lg border border-black/5 hover:border-black/20 transition-all"
                              >
                                Mark as {app.is_read ? 'Unread' : 'Read'}
                              </button>
                              {['approved', 'rejected'].map(status => (
                                <button
                                  key={status}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateStatus(app.id, status);
                                  }}
                                  className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all ${
                                    app.status === status
                                      ? status === 'approved'
                                        ? 'bg-emerald-500 text-white border-emerald-500'
                                        : 'bg-red-500 text-white border-red-500'
                                      : 'bg-white text-zinc-600 border-black/10 hover:border-black/30'
                                  }`}
                                >
                                  {status === 'approved' ? 'Approve' : 'Reject'}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
