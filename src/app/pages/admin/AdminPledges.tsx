import React, { useState, useEffect } from 'react';
import { Award, Download, Search, RefreshCw, ShieldCheck, UserCheck, MapPin, Calendar, Building, FileSpreadsheet } from 'lucide-react';
import { api } from '../../api';
import { AdminSidebar } from '../../components/AdminSidebar';

export default function AdminPledges() {
  const [pledges, setPledges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchPledges = async () => {
    setLoading(true);
    try {
      const data = await api.getAllPledgeCertificates();
      setPledges(data || []);
    } catch (err) {
      console.error("Error fetching pledge certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPledges();
  }, []);

  const handleExportCSV = () => {
    if (pledges.length === 0) return;
    const headers = ['Certificate ID', 'Full Name', 'Email', 'Phone', 'Category', 'Gender', 'State', 'District', 'Organization', 'Pledge Date'];
    const rows = pledges.map(p => [
      `"${p.certificate_id || ''}"`,
      `"${p.full_name || ''}"`,
      `"${p.email || ''}"`,
      `"${p.phone || ''}"`,
      `"${p.category || ''}"`,
      `"${p.gender || ''}"`,
      `"${p.state || ''}"`,
      `"${p.district || ''}"`,
      `"${p.organization || ''}"`,
      `"${p.created_at ? new Date(p.created_at).toLocaleString() : ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Nasha_Mukt_Pledges_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = pledges.filter(p => {
    const matchesSearch = 
      (p.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.certificate_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.state || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-500" /> Nasha Mukt YUVA Pledges & Certificates
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage registered delegates, verify commitment certificates, and export records.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchPledges}
                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition shadow-sm"
                title="Refresh List"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleExportCSV}
                disabled={pledges.length === 0}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export CSV ({filtered.length})
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Pledges</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{pledges.length}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Nasha Mukt Pledges</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {pledges.filter(p => !p.category?.toLowerCase().startsWith('netra suraksha')).length}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Netra Suraksha</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {pledges.filter(p => p.category?.toLowerCase().startsWith('netra suraksha')).length}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">States Represented</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {new Set(pledges.map(p => p.state)).size}
                </p>
              </div>
            </div>
          </div>


          {/* Filters & Search */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by name, cert ID, email, or state..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium"
            >
              <option value="all">All Categories</option>
              <option value="Youth">Youth / Student</option>
              <option value="Volunteer">NGO Volunteer</option>
              <option value="Partner Delegate">Partner Delegate</option>
              <option value="Educator">Educator</option>
              <option value="Citizen">General Citizen</option>
            </select>
          </div>

          {/* Pledges Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading pledge certificate registry...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No matching pledge records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Certificate ID</th>
                      <th className="px-6 py-4">Delegate Name</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filtered.map(p => (
                      <tr key={p.id || p.certificate_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                          {p.certificate_id}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                          {p.full_name}
                          {p.organization && (
                            <span className="block text-xs text-slate-400 font-normal">{p.organization}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <div>{p.email}</div>
                          <div className="text-slate-400">{p.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold">
                            {p.category || 'Youth'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {p.district ? `${p.district}, ` : ''}{p.state}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
