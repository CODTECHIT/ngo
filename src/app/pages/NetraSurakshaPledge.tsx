import React, { useState, useEffect, useRef } from 'react';
import { api, generateCertificateId } from '../api';
import confetti from 'canvas-confetti';
import { Eye, Award, Download, Share2, CheckCircle2, ShieldCheck, Sparkles, HeartHandshake, Users, ArrowRight, Printer, RefreshCw, QrCode } from 'lucide-react';
import { Link } from 'react-router';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi NCR", "Jammu and Kashmir", "Ladakh", "Puducherry", "Other"
];

export const NetraSurakshaPledge: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'Citizen',
    gender: 'Male',
    state: 'Telangana',
    district: 'Hyderabad',
    organization: '',
    pledgeAgreed: false,
  });

  const [loading, setLoading] = useState(false);
  const [pledgeCount, setPledgeCount] = useState<number>(0);
  const [submittedCert, setSubmittedCert] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Fetch live Netra Suraksha pledge count
    api.getNetraPledgeCount().then(count => setPledgeCount(count)).catch(() => { });
  }, []);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pledgeAgreed) {
      alert("Please agree to the Netra Suraksha pledge to continue.");
      return;
    }

    setLoading(true);
    const certId = generateCertificateId('Netra Suraksha');

    const newRecord = {
      certificate_id: certId,
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      category: `Netra Suraksha - ${formData.category}`,
      gender: formData.gender,
      state: formData.state,
      district: formData.district.trim() || 'General',
      organization: formData.organization.trim() || 'Vision Ambassador',
      pledge_taken: true,
      created_at: new Date().toISOString()
    };

    try {
      const savedData = await api.createPledgeCertificate(newRecord);
      setSubmittedCert(savedData);
      setPledgeCount(prev => prev + 1);
    } catch (err) {
      console.warn("Saved locally for canvas generation:", err);
      setSubmittedCert(newRecord);
    } finally {
      setLoading(false);

      // Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (cErr) { }
    }
  };

  // Canvas Certificate Draw Engine for Netra Suraksha
  useEffect(() => {
    if (!submittedCert || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bgImg = new Image();
    bgImg.src = '/Netra Suraksha Abhiyaan Eye Care & Donation Pledge certificuite.png';
    bgImg.onload = () => {
      // Set canvas resolution to match the image exactly
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      // Draw background
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Body Text Above Name
      ctx.fillStyle = '#000000';
      ctx.font = '500 24px Georgia, "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText('This is to proudly certify that', canvas.width / 2, canvas.height * 0.49);

      // Recipient Name (Center)
      ctx.fillStyle = '#000000'; // Make name dark
      ctx.font = 'bold italic 55px "Times New Roman", Georgia, serif';
      ctx.fillText(submittedCert.full_name, canvas.width / 2, canvas.height * 0.56);

      // Body Text Below Name (Pledge Text)
      ctx.fillStyle = '#000000';
      ctx.font = 'italic 24px "Times New Roman", Georgia, serif';
      ctx.fillText('has solemnly taken the Netra Suraksha Pledge, committing to practice regular eye care,', canvas.width / 2, canvas.height * 0.63);
      ctx.fillText('prevent avoidable blindness, and spread eye donation awareness for a brighter India.', canvas.width / 2, canvas.height * 0.67);

      // Certificate ID (Placed above the bottom badge)
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 16px "Inter", monospace';
      ctx.fillText(`CERTIFICATE ID: ${submittedCert.certificate_id}`, canvas.width / 2, canvas.height * 0.72);

      // Date (Left Side, above the DATE line)
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px "Times New Roman", Georgia, serif';
      const dateStr = new Date(submittedCert.created_at || Date.now()).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
      ctx.fillText(dateStr, canvas.width * 0.31, canvas.height * 0.82);

      // Authorized Sign (Right Side, above the AUTHORIZED SIGNATURE line)
      ctx.font = 'bold italic 30px "Times New Roman", Georgia, serif';
      ctx.fillText('Lion Dr. R. Srinivas', canvas.width * 0.69, canvas.height * 0.81);
      ctx.font = 'bold 18px "Inter", sans-serif';
      ctx.fillText('Director', canvas.width * 0.69, canvas.height * 0.835);
    };
  }, [submittedCert]);

  // Actions
  const handleDownloadPNG = () => {
    if (!canvasRef.current || !submittedCert) return;
    try {
      const canvas = canvasRef.current;
      const imageURI = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `Netra_Suraksha_Certificate_${submittedCert.certificate_id}_${submittedCert.full_name.replace(/\s+/g, '_')}.png`;
      link.href = imageURI;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download failed:", e);
      alert("Download error. Please right click certificate image and select Save As.");
    }
  };

  const handlePrint = () => {
    if (!canvasRef.current || !submittedCert) return;
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Certificate - ${submittedCert.certificate_id}</title>
              <style>
                @page { size: landscape; margin: 0; }
                body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #ffffff; }
                img { max-width: 100%; max-height: 100vh; object-fit: contain; }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" onload="window.print();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        window.print();
      }
    } catch (e) {
      window.print();
    }
  };

  const handleShareWhatsApp = () => {
    if (!submittedCert) return;
    const text = encodeURIComponent(`I took the Netra Suraksha Eye Care & Donation Pledge to protect vision and support eye health! Get your free certificate here: https://ngo-azure-zeta.vercel.app/netra-suraksha-pledge`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-sky-700 via-teal-700 to-cyan-800 text-white rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden border border-cyan-500/30">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-100 uppercase tracking-widest border border-white/20">
                <Eye className="w-4 h-4 text-cyan-300" /> Sri Shree Vision Foundation Drive
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Netra Suraksha Abhiyaan   Eye Care & Donation Pledge
              </h1>
              <p className="text-cyan-100 text-sm sm:text-base leading-relaxed">
                Protect your vision, prevent avoidable blindness, and support eye donation awareness across India. Take the online pledge and instantly download your official <strong>Certificate of Commitment</strong>.
              </p>
            </div>

            {/* Live Counter */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl text-center shrink-0 w-full sm:w-auto shadow-inner">
              <div className="flex items-center justify-center gap-2 text-cyan-300 mb-1">
                <Users className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Netra Suraksha Pledges</span>
              </div>
              <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
                {pledgeCount.toLocaleString('en-IN')}+
              </div>
              <p className="text-xs text-cyan-100 mt-1">Vision Ambassadors Registered</p>
            </div>
          </div>
        </div>

        {!submittedCert ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Guidelines */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-cyan-600" /> Why Take The Netra Suraksha Pledge?
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    <span><strong>Eye Health Awareness:</strong> Practice annual eye checkups & protect digital eye strain.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    <span><strong>Prevent Blindness:</strong> Support early screening for cataracts and glaucoma.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    <span><strong>Eye Donation Support:</strong> Promote corneal donation to restore sight to corneal blind individuals.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white p-6 rounded-3xl shadow-lg space-y-3">
                <HeartHandshake className="w-8 h-8 text-cyan-200" />
                <h4 className="text-lg font-bold">The Vision Commitment</h4>
                <p className="text-xs text-cyan-50 leading-relaxed italic">
                  "I solemnly pledge to take proper care of my eyes, encourage regular vision testing in my family and community, and advocate for eye donation to bring light into someone's life."
                </p>
              </div>

              <div className="text-center p-4 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">Already issued a certificate?</p>
                <Link to="/verify-certificate" className="inline-flex items-center text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline mt-1">
                  <QrCode className="w-3.5 h-3.5 mr-1" /> Search & Verify Certificate Online
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-6 h-6 text-cyan-600" /> Netra Suraksha Registration Form
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your details accurately to generate your official Netra Suraksha Certificate of Commitment.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Full Name (To appear on certificate) *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Dr. Anita Rao"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      <option value="Citizen">General Citizen</option>
                      <option value="Eye Donation Ambassador">Eye Donation Ambassador</option>
                      <option value="Student">Student / Youth</option>
                      <option value="Medical / Healthcare Professional">Medical / Healthcare Professional</option>
                      <option value="NGO Volunteer">NGO Volunteer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      State / UT *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      {INDIAN_STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      District / City *
                    </label>
                    <input
                      type="text"
                      name="district"
                      required
                      placeholder="e.g. Hyderabad"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    College / Hospital / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    name="organization"
                    placeholder="Name of your institution or organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 p-4 bg-cyan-50 dark:bg-cyan-950/30 rounded-2xl border border-cyan-200 dark:border-cyan-900 cursor-pointer">
                    <input
                      type="checkbox"
                      name="pledgeAgreed"
                      checked={formData.pledgeAgreed}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      I hereby take the <strong>Netra Suraksha Pledge</strong> to protect my vision through regular eye checkups, spread eye care awareness, and advocate for eye donation to bring sight to those in need.
                    </span>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !formData.pledgeAgreed}
                    className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                  >
                    {loading ? 'Generating Certificate...' : 'Take Netra Suraksha Pledge & Get Certificate'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 rounded-full font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-teal-500" /> Certificate Successfully Issued!
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Congratulations, {submittedCert.full_name}!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
                Thank you for becoming a Netra Suraksha Vision Ambassador. Download your official Certificate of Commitment below.
              </p>
            </div>

            <div className="overflow-x-auto p-4 bg-slate-900 rounded-2xl shadow-inner inline-block max-w-full">
              <canvas
                ref={canvasRef}
                className="rounded-xl shadow-2xl mx-auto border border-slate-700 max-w-full h-auto"
                style={{ width: '100%', maxWidth: '900px', height: 'auto' }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleDownloadPNG}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" /> Download Certificate (PNG)
              </button>

              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 text-sm dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 text-sm"
              >
                <Share2 className="w-4 h-4" /> Share on WhatsApp
              </button>

              <button
                onClick={() => setSubmittedCert(null)}
                className="px-5 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" /> Issue Another Certificate
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 text-xs text-slate-500">
              <span>Certificate ID: <strong className="font-mono text-slate-800 dark:text-slate-200">{submittedCert.certificate_id}</strong></span>
              <span>•</span>
              <Link to={`/verify-certificate?id=${submittedCert.certificate_id}`} className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
                Verify Online
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
