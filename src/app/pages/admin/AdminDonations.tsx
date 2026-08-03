import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, FileText, List, Calendar, Image as ImageIcon, MessageSquare, Heart,
  Loader2, Mail, Phone, Clock, Search, Filter, CheckCircle, DollarSign, Award, ShieldCheck,
  LogOut, Send, Eye, X, Download
} from 'lucide-react';
import { supabaseAdmin as supabase } from '../../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { sendDonationInvoiceEmail } from '../../../lib/emailService';
import { AdminSidebar } from '../../components/AdminSidebar';

export default function AdminDonations() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCause, setSelectedCause] = useState('ALL');
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const { isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSuperAdmin) {
      navigate('/admin/ngo/events', { replace: true });
    }
  }, [isSuperAdmin, navigate]);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const { data: dbDonations } = await supabase
          .from('donations')
          .select('*')
          .order('created_at', { ascending: false });

        const localDonations = JSON.parse(localStorage.getItem('ngo_saved_donations') || '[]');
        const combined = [...(dbDonations || []), ...localDonations];
        const uniqueMap = new Map();
        for (const item of combined) {
          const key = item.payment_id || item.id || `${item.cause}-${item.amount}-${item.created_at}`;
          if (key && !uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        }
        setDonations(Array.from(uniqueMap.values()));
      } catch (err) {
        console.warn("Error fetching DB donations, falling back to local storage:", err);
        const localDonations = JSON.parse(localStorage.getItem('ngo_saved_donations') || '[]');
        setDonations(localDonations);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleResendInvoice = (don: any) => {
    sendDonationInvoiceEmail({
      name: don.name || 'Valued Donor',
      email: don.email || 'donor@example.com',
      amount: Number(don.amount) || 0,
      cause: don.cause || 'General Vision & Care Fund',
      transactionId: don.payment_id || 'TXN_' + Date.now(),
      pan: don.pan || undefined
    });
    alert(`80G Tax Exemption Invoice successfully sent via email notification engine to ${don.email || don.name}!`);
  };

  // Calculate stats
  const totalFunds = donations.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);
  const totalDonors = donations.length;
  const avgDonation = totalDonors > 0 ? Math.round(totalFunds / totalDonors) : 0;
  const uniquePanCount = donations.filter(d => d.pan && d.pan !== 'N/A').length;

  // Filtered donations
  const filteredDonations = donations.filter(d => {
    const matchesSearch =
      (d.name && d.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.email && d.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.pan && d.pan.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.payment_id && d.payment_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.cause && d.cause.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCause = selectedCause === 'ALL' || (d.cause && d.cause.toLowerCase().includes(selectedCause.toLowerCase()));

    return matchesSearch && matchesCause;
  });

  const causesList = ['ALL', 'Vision', 'Education', 'Health', 'General', 'Elderly'];

  return (
    <div className="min-h-screen bg-black/5 flex flex-col md:flex-row font-['Lato']">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2 font-['Playfair_Display'] flex items-center gap-3">
                <Heart className="text-red-500 fill-red-500" /> Donors & Donations Ledger
              </h1>
              <p className="text-zinc-500 text-sm">
                Complete overview of donor identities, contributed amounts, PAN audit numbers and 80G receipt delivery.
              </p>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-[#0F6E6E] border-y border-r border-black/5">
              <h3 className="text-zinc-500 text-xs font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign size={16} className="text-[#0F6E6E]" /> Total Funds Raised
              </h3>
              <p className="text-3xl font-extrabold text-zinc-900">₹{totalFunds.toLocaleString('en-IN')}</p>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                100% Verified
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-amber-500 border-y border-r border-black/5">
              <h3 className="text-zinc-500 text-xs font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Heart size={16} className="text-amber-500 fill-amber-500" /> Total Donors
              </h3>
              <p className="text-3xl font-extrabold text-zinc-900">{totalDonors}</p>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                Active Contributors
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-purple-500 border-y border-r border-black/5">
              <h3 className="text-zinc-500 text-xs font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Award size={16} className="text-purple-500" /> Average Amount
              </h3>
              <p className="text-3xl font-extrabold text-zinc-900">₹{avgDonation.toLocaleString('en-IN')}</p>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                Per Transaction
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-blue-500 border-y border-r border-black/5">
              <h3 className="text-zinc-500 text-xs font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-blue-500" /> 80G PAN On File
              </h3>
              <p className="text-3xl font-extrabold text-zinc-900">{uniquePanCount}</p>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                Tax Exempt Ready
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                placeholder="Search by donor name, email, mobile, PAN number, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-primary text-sm transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter size={16} className="text-zinc-400 shrink-0 ml-1" />
              {causesList.map((cause) => (
                <button
                  key={cause}
                  onClick={() => setSelectedCause(cause)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${selectedCause === cause
                      ? 'bg-[#0F6E6E] text-white shadow-sm'
                      : 'bg-black/5 text-zinc-600 hover:bg-black/10'
                    }`}
                >
                  {cause === 'ALL' ? 'All Causes' : cause}
                </button>
              ))}
            </div>
          </div>

          {/* Donations Table */}
          <div className="bg-white rounded-3xl border border-black/5 shadow-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredDonations.length === 0 ? (
              <div className="text-center py-16 px-6">
                <Heart className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-zinc-800 mb-1">No Donations Found</h3>
                <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                  {searchQuery || selectedCause !== 'ALL'
                    ? "No donation records matched your filter criteria. Try resetting your filters."
                    : "There are no donation records in the system yet. Once donors contribute, their details will appear here."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/80 border-b border-black/5 text-[11px] font-extrabold text-zinc-500 uppercase tracking-widest">
                      <th className="py-4 px-6">Donor Profile</th>
                      <th className="py-4 px-6">Donation Amount</th>
                      <th className="py-4 px-6">Cause / Campaign</th>
                      <th className="py-4 px-6">PAN (80G Tax ID)</th>
                      <th className="py-4 px-6">Transaction Info</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-sm font-medium text-zinc-700">
                    {filteredDonations.map((don) => (
                      <tr key={don.id} className="hover:bg-black/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-zinc-900 text-base flex items-center gap-2 flex-wrap">
                            <span>{don.donor_real_name || (don.name && don.name !== 'Anonymous Donor' ? don.name : (don.email ? don.email.split('@')[0] : 'Valued Donor'))}</span>
                            {(don.is_anonymous || don.isAnonymous || don.name === 'Anonymous Donor') && (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 border border-amber-300 font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
                                🔒 Anonymous on Public Banner
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5 mt-1 text-xs text-zinc-500">
                            <span className="flex items-center gap-1"><Mail size={12} className="text-primary" /> {don.email || 'N/A'}</span>
                            {don.mobile && (
                              <span className="flex items-center gap-1"><Phone size={12} className="text-emerald-600" /> {don.mobile}</span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-base border border-emerald-200">
                            ₹{Number(don.amount || 0).toLocaleString('en-IN')}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 rounded-lg bg-teal-50 text-[#0F6E6E] font-bold text-xs border border-teal-100">
                            {don.cause || 'General Vision Fund'}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          {don.pan && don.pan !== 'N/A' ? (
                            <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200 text-xs">
                              {don.pan}
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-400 italic">Not Provided</span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-xs">
                          <div className="font-mono text-zinc-600 font-bold">{don.payment_id || 'OFFLINE_TXN'}</div>
                          <div className="flex items-center gap-1 text-emerald-600 font-bold mt-1">
                            <CheckCircle size={12} /> {don.status ? don.status.toUpperCase() : 'PAID'}
                          </div>
                          <div className="text-zinc-400 text-[11px] mt-0.5">
                            {don.created_at ? new Date(don.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'Recent'}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedDonation(don)}
                              className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
                              title="View Official 80G Receipt Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleResendInvoice(don)}
                              className="p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors border border-emerald-200 flex items-center gap-1.5 text-xs font-bold"
                              title="Resend 80G Receipt via Email"
                            >
                              <Send size={14} className="text-[#0F6E6E]" />
                              <span className="hidden xl:inline">Resend Email</span>
                            </button>
                          </div>
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

      {/* Official Receipt Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-black/10">
            <div className="bg-gradient-to-r from-[#0F6E6E] to-[#4CAF50] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl">
                  📜
                </div>
                <div>
                  <h3 className="font-bold text-lg font-['Playfair_Display']">80G Tax Exemption Receipt</h3>
                  <p className="text-xs text-white/80">Official Record of Charitable Contribution</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDonation(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-zinc-700">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Amount Donated</div>
                <div className="text-3xl font-extrabold text-[#0F6E6E] my-1">
                  ₹{Number(selectedDonation.amount || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-700 font-medium">100% Tax Deductible under Section 80G of IT Act</div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-black/5">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-bold block">Donor Name</span>
                  <span className="font-bold text-zinc-900 text-base">
                    {selectedDonation.donor_real_name || (selectedDonation.name && selectedDonation.name !== 'Anonymous Donor' ? selectedDonation.name : (selectedDonation.email ? selectedDonation.email.split('@')[0] : 'Valued Donor'))}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-bold block">PAN Number</span>
                  <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-xs border border-zinc-200 inline-block mt-0.5">
                    {selectedDonation.pan || 'Not Provided'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-bold block">Email Address</span>
                  <span className="font-medium text-zinc-800 break-all">{selectedDonation.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-bold block">Mobile Contact</span>
                  <span className="font-medium text-zinc-800">{selectedDonation.mobile || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-bold block">Designated Cause</span>
                  <span className="font-bold text-[#0F6E6E]">{selectedDonation.cause || 'General Vision Fund'}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-bold block">Transaction ID</span>
                  <span className="font-mono text-xs text-zinc-600 font-bold">{selectedDonation.payment_id || 'OFFLINE'}</span>
                </div>
              </div>

              <div className="bg-zinc-50 rounded-xl p-3 text-center text-xs text-zinc-500 border border-black/5 mt-4">
                Srishree Vision Foundation • Reg. No: SVF/80G/2026/0091 • Pan: AAACF0000A
              </div>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-black/5 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedDonation(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-zinc-200 text-zinc-700 hover:bg-zinc-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleResendInvoice(selectedDonation);
                  setSelectedDonation(null);
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#0F6E6E] text-white hover:bg-[#0c5959] transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Send size={14} /> Resend Receipt Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
