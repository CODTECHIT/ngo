import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { api } from '../api';
import { ShieldCheck, XCircle, Search, Award, CheckCircle, ArrowLeft, Building, MapPin, Calendar, User, FileText } from 'lucide-react';

export const VerifyCertificate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const certIdParam = searchParams.get('id') || '';

  const [inputCertId, setInputCertId] = useState(certIdParam);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [certData, setCertData] = useState<any>(null);

  const fetchCertificate = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.getCertificateById(id.trim().toUpperCase());
      setCertData(data);
    } catch (err) {
      console.error(err);
      setCertData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certIdParam) {
      fetchCertificate(certIdParam);
    }
  }, [certIdParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCertificate(inputCertId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-6">
          <Link to="/nasha-mukt-pledge" className="inline-flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Nasha Mukt YUVA Campaign
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white p-8 rounded-3xl shadow-xl text-center mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <ShieldCheck className="w-16 h-16 mx-auto mb-3 text-amber-200" />
          <h1 className="text-3xl font-extrabold tracking-tight">Official Certificate Verification</h1>
          <p className="mt-2 text-amber-100 text-sm max-w-xl mx-auto">
            Verify the authenticity of Nasha Mukt YUVA Pledge Certificates issued by Sri Shree Vision Foundation & MY Bharat Initiative.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. CERT-NMY-2026-8942)"
                value={inputCertId}
                onChange={(e) => setInputCertId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white uppercase font-mono tracking-wider text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputCertId.trim()}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </form>
        </div>

        {/* Verification Result Card */}
        {searched && (
          <div>
            {certData ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 border-emerald-500/30 overflow-hidden">
                {/* Status Bar */}
                <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-5 text-emerald-800 dark:text-emerald-300 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-bold text-lg text-emerald-700 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                        Authentic & Verified Certificate
                      </span>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        This certificate was officially recorded in the NGO Pledge Registry.
                      </p>
                    </div>
                  </div>
                  <span className="bg-emerald-500 text-white font-mono text-xs px-3 py-1.5 rounded-full font-bold">
                    ID: {certData.certificate_id}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                      {certData.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {certData.full_name}
                      </h2>
                      <span className="inline-block mt-1 px-3 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 rounded-full text-xs font-semibold">
                        {certData.category || 'Youth Delegate'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase">Campaign Name</p>
                        <p className="font-semibold text-slate-900 dark:text-white">Viksit & Nasha Mukt Yuva Initiative</p>

                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase">Date of Pledge</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {certData.created_at ? new Date(certData.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Verified Date'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase">Location</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {certData.district}, {certData.state}
                        </p>
                      </div>
                    </div>

                    {certData.organization && (
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase">Institution / Organization</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {certData.organization}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                    <strong>Pledge Commitment:</strong> "I solemnly pledge that I will refrain from drug and substance abuse, actively promote a healthy, addiction-free lifestyle among youth, and contribute towards a Nasha Mukt (Drug-Free) India."
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl text-center border-2 border-red-200 dark:border-red-900">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Certificate Not Found</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 max-w-md mx-auto">
                  No certificate record was found for ID <span className="font-mono font-bold text-red-600">{inputCertId}</span>. Please double-check the ID or issue a new pledge certificate.
                </p>
                <div className="mt-6">
                  <Link
                    to="/nasha-mukt-pledge"
                    className="inline-flex items-center px-5 py-2.5 bg-orange-600 text-white font-bold rounded-xl shadow-md hover:bg-orange-700 transition"
                  >
                    Take the Pledge & Issue Certificate
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
