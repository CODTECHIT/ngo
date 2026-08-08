import React, { useState, useEffect, useRef } from 'react';
import { api, generateCertificateId } from '../api';
import confetti from 'canvas-confetti';
import { Award, Download, Share2, CheckCircle2, ShieldCheck, Sparkles, HeartHandshake, Users, ArrowRight, Printer, RefreshCw, QrCode } from 'lucide-react';
import { Link } from 'react-router';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi NCR", "Jammu and Kashmir", "Ladakh", "Puducherry", "Other"
];

export const VisionWarriorPledge: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'Youth',
    gender: 'Male',
    state: 'Maharashtra',
    district: '',
    organization: '',
    pledgeAgreed: false,
  });

  const [loading, setLoading] = useState(false);
  const [pledgeCount, setPledgeCount] = useState<number>(0);
  const [submittedCert, setSubmittedCert] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Fetch live Vision Warrior count
    api.getVisionWarriorPledgeCount().then(count => setPledgeCount(count)).catch(() => { });
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
      alert("Please agree to the Nasha Mukt pledge to continue.");
      return;
    }

    setLoading(true);

      const newCertId = generateCertificateId('Vision Warrior');

    const newRecord = {
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      category: 'Vision Warrior',
      gender: formData.gender,
      state: formData.state,
      district: formData.district.trim() || 'General',
      organization: formData.organization.trim() || 'Independent Volunteer',
      pledge_taken: true,
      created_at: new Date().toISOString(),
      certificate_id: newCertId
    };

    try {
      const savedData = await api.createPledgeCertificate(newRecord);
      setSubmittedCert(savedData);
      setPledgeCount(prev => prev + 1);
    } catch (err) {
      console.warn("Saved locally for canvas generation (DB fallback):", err);
      const fallbackId = generateCertificateId('Vision Warrior');
      setSubmittedCert({ ...newRecord, certificate_id: fallbackId });
    } finally {
      setLoading(false);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (cErr) { }
    }
  };

  // Canvas Certificate Draw Engine
  useEffect(() => {
    if (!submittedCert || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bgImg = new Image();
    bgImg.src = '/vision warrior.png';
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
      ctx.fillText('has joined the Vision Warrior Initiative as a dedicated fundraiser,', canvas.width / 2, canvas.height * 0.63);
      ctx.fillText('empowering communities and supporting research for blinding diseases.', canvas.width / 2, canvas.height * 0.67);

      // Certificate ID (Placed above the bottom badge)
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 16px "Inter", monospace';
      ctx.fillText(`CERTIFICATE ID: ${submittedCert.certificate_id}`, canvas.width / 2, canvas.height * 0.705);

      // Date (Left Side, above the DATE line)
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px "Times New Roman", Georgia, serif';
      const dateStr = new Date(submittedCert.created_at || Date.now()).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
      ctx.fillText(dateStr, canvas.width * 0.30, canvas.height * 0.81);

      // Authorized Sign (Right Side, above the AUTHORIZED SIGNATURE line)
      const signImg = new Image();
      signImg.src = '/sign.png';
      signImg.onload = () => {
        const signWidth = 140;
        const signHeight = (signImg.height / signImg.width) * signWidth;
        ctx.drawImage(signImg, canvas.width * 0.70 - signWidth / 2, canvas.height * 0.81 - signHeight - 10, signWidth, signHeight);
        
        ctx.font = 'bold italic 30px "Times New Roman", Georgia, serif';
        ctx.fillText('Lion Dr. R. Srinivas', canvas.width * 0.70, canvas.height * 0.81);
        ctx.font = 'bold 18px "Inter", sans-serif';
        ctx.fillText('Director', canvas.width * 0.70, canvas.height * 0.835);
      };
    };
  }, [submittedCert]);

  // Actions
  const handleDownloadPNG = () => {
    if (!canvasRef.current || !submittedCert) return;
    try {
      const canvas = canvasRef.current;
      const imageURI = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `Pledge_Certificate_${submittedCert.certificate_id || 'NMY'}_${submittedCert.full_name.replace(/\s+/g, '_')}.png`;
      link.href = imageURI;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download failed:", e);
      alert("Downloading image directly... If your browser blocks popups, right click the certificate and select 'Save Image As'.");
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
      console.error("Print failed:", e);
      window.print();
    }
  };


  const handleShareWhatsApp = () => {
    if (!submittedCert) return;
    const text = encodeURIComponent(`I just took the Vision Warrior for a Drug-Free India and earned my Certificate of Commitment! Take the pledge here: https://ngo-azure-zeta.vercel.app/nasha-mukt-pledge`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 text-white rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden border border-cyan-500/30">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-teal-100 uppercase tracking-widest border border-white/20">
                <Sparkles className="w-4 h-4 text-cyan-300" /> Government & NGO Youth Drive
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Vision Warrior Program
              </h1>

              <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
                Grassroots fundraising and awareness initiative to support research into retinal degenerative diseases. Join us and download your official <strong>Certificate of Appreciation</strong> for free.
              </p>
            </div>

            {/* Live Counter Badge */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl text-center shrink-0 w-full sm:w-auto shadow-inner">
              <div className="flex items-center justify-center gap-2 text-cyan-300 mb-1">
                <Users className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Live Pledge Count</span>
              </div>
              <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
                {pledgeCount.toLocaleString('en-IN')}+
              </div>
              <p className="text-xs text-teal-100 mt-1">Youth Pledged Nationwide</p>
            </div>
          </div>
        </div>

        {!submittedCert ? (
          /* Registration Form & Guidelines Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Guidelines & Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-teal-500" /> Why Take The Pledge?
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Empower Youth:</strong> Be an active leader in driving substance abuse awareness.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Free Certification:</strong> Download your verifiable digital pledge certificate.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Recognized Credentials:</strong> Issued under Sri Shree Vision Foundation & MY Bharat Youth Movement.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-6 rounded-3xl shadow-lg space-y-3">
                <HeartHandshake className="w-8 h-8 text-teal-200" />
                <h4 className="text-lg font-bold">The Vision Warrior Affirmation</h4>
                <p className="text-xs text-teal-50 leading-relaxed italic">
                  "I pledge to act as a Vision Warrior, turning personal gatherings into fundraisers and spreading awareness to support treatments and cures for blinding diseases like retinitis pigmentosa and macular degeneration."
                </p>
              </div>

              <div className="text-center p-4 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">Already took the pledge?</p>
                <Link to="/verify-certificate" className="inline-flex items-center text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline mt-1">
                  <QrCode className="w-3.5 h-3.5 mr-1" /> Search & Verify Certificate Online
                </Link>
              </div>
            </div>

            {/* Right Registration Form */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-teal-500" /> Delegate Registration Form
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your details accurately as they will be printed on your certificate.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Full Name (To appear on certificate) *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Email & Phone */}
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Category & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Delegate Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="Youth">Youth / Student</option>
                      <option value="Volunteer">NGO Volunteer</option>
                      <option value="Partner Delegate">Partner Organization Delegate</option>
                      <option value="Educator">Educator / Teacher</option>
                      <option value="Citizen">General Citizen</option>
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* State & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      State / UT *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                      placeholder="e.g. Pune / Mumbai"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    College / School / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    name="organization"
                    placeholder="Name of your college, school, or workplace"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Pledge Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 p-4 bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-900 cursor-pointer">
                    <input
                      type="checkbox"
                      name="pledgeAgreed"
                      checked={formData.pledgeAgreed}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      I hereby confirm my participation in the Vision Warrior program and pledge to raise funds and awareness for retinal degenerative diseases.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !formData.pledgeAgreed}
                    className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                  >
                    {loading ? 'Generating Certificate...' : 'Take Pledge & Get Free Certificate'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Certificate Generated Output View */
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Certificate Successfully Generated!
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Congratulations, {submittedCert.full_name}!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
                Your pledge has been officially registered. Download your high-resolution Certificate of Commitment below or share it on social media.
              </p>
            </div>

            {/* Canvas Certificate Render Preview */}
            <div className="overflow-x-auto p-4 bg-slate-900 rounded-2xl shadow-inner inline-block max-w-full">
              <canvas
                ref={canvasRef}
                className="rounded-xl shadow-2xl mx-auto border border-slate-700 max-w-full h-auto"
                style={{ width: '100%', maxWidth: '900px', height: 'auto' }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleDownloadPNG}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 text-sm"
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
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 text-sm"
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
              <Link to={`/verify-certificate?id=${submittedCert.certificate_id}`} className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                Verify Online
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
