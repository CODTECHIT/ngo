import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
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

export const Pledge: React.FC = () => {
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
    // Fetch live Nasha Mukt pledge count
    api.getNashaPledgeCount().then(count => setPledgeCount(count)).catch(() => { });
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

    const newRecord = {
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      category: formData.category,
      gender: formData.gender,
      state: formData.state,
      district: formData.district.trim() || 'General',
      organization: formData.organization.trim() || 'Independent Volunteer',
      pledge_taken: true,
      created_at: new Date().toISOString()
    };

    try {
      const savedData = await api.createPledgeCertificate(newRecord);
      setSubmittedCert(savedData);
      setPledgeCount(prev => prev + 1);
    } catch (err) {
      console.warn("Saved locally for canvas generation (DB fallback):", err);
      const fallbackId = `CERT-NMY-2026-${Math.floor(10000 + Math.random() * 90000)}`;
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

    // Set resolution (1600 x 1131 landscape)
    canvas.width = 1600;
    canvas.height = 1131;

    // Background Parchment
    const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1131);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.5, '#fffdf9');
    bgGrad.addColorStop(1, '#fffaf0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1600, 1131);

    // Official Double Gold Frame
    // Outer Border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#92400e'; // Deep Amber
    ctx.strokeRect(36, 36, 1528, 1059);

    // Middle Gold Accent Line
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(54, 54, 1492, 1023);

    // Inner Fine Line
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(62, 62, 1476, 1007);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 0, 45, 5);
      ctx.fillRect(0, 0, 5, 45);
      ctx.restore();
    };
    drawCorner(74, 74, 0);
    drawCorner(1526, 74, 90);
    drawCorner(1526, 1057, 180);
    drawCorner(74, 1057, 270);

    // Top Tricolor Accent Line
    const triGrad = ctx.createLinearGradient(350, 0, 1250, 0);
    triGrad.addColorStop(0, '#f97316');
    triGrad.addColorStop(0.5, '#ffffff');
    triGrad.addColorStop(1, '#16a34a');
    ctx.fillStyle = triGrad;
    ctx.fillRect(450, 62, 700, 6);

    // Top Center Official Logo Emblem
    const logoImg = new Image();
    logoImg.src = '/logo.jpeg';
    logoImg.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(800, 150, 55, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(logoImg, 800 - 55, 150 - 55, 110, 110);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(800, 150, 55, 0, 2 * Math.PI);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#b45309';
      ctx.stroke();
    };

    // Fallback logo frame
    ctx.save();
    ctx.beginPath();
    ctx.arc(800, 150, 55, 0, 2 * Math.PI);
    ctx.fillStyle = '#fef3c7';
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#b45309';
    ctx.stroke();
    ctx.restore();

    // Organization & Header Title
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 30px "Times New Roman", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('SRI SHREE VISION FOUNDATION', 800, 242);

    ctx.fillStyle = '#475569';
    ctx.font = '500 16px "Inter", sans-serif';
    ctx.fillText('In Association with MY Bharat Initiative  |  Viksit & Nasha Mukt Yuva Initiative', 800, 272);

    // Formal Divider Line with Center Ornament
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(350, 300);
    ctx.lineTo(680, 300);
    ctx.moveTo(920, 300);
    ctx.lineTo(1250, 300);
    ctx.stroke();

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 18px Georgia, serif';
    ctx.fillText('❖  OFFICIAL PLEDGE  ❖', 800, 305);

    // Main Certificate Title
    ctx.fillStyle = '#9a3412';
    ctx.font = 'bold 46px "Times New Roman", Georgia, serif';
    ctx.fillText('CERTIFICATE OF COMMITMENT', 800, 375);

    // Body Certification Text
    ctx.fillStyle = '#334155';
    ctx.font = '500 22px Georgia, "Times New Roman", serif';
    ctx.fillText('This is to proudly certify that', 800, 440);

    // Recipient Name
    ctx.fillStyle = '#9a3412';
    ctx.font = 'bold italic 50px "Times New Roman", Georgia, serif';
    ctx.fillText(submittedCert.full_name, 800, 515);

    // Gold Accent Underline
    const nameWidth = ctx.measureText(submittedCert.full_name).width;
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(800 - nameWidth / 2 - 25, 535);
    ctx.lineTo(800 + nameWidth / 2 + 25, 535);
    ctx.stroke();

    // Location Detail
    ctx.fillStyle = '#475569';
    ctx.font = '500 20px Georgia, serif';
    const locText = `from ${submittedCert.district ? submittedCert.district + ', ' : ''}${submittedCert.state}`;
    ctx.fillText(locText, 800, 580);

    // Formal Affirmation Statement
    ctx.fillStyle = '#1e293b';
    ctx.font = 'italic 20px "Times New Roman", Georgia, serif';
    ctx.fillText('has solemnly taken the Nasha Mukt YUVA Pledge, committing to remain drug-free,', 800, 638);
    ctx.fillText('spread anti-substance abuse awareness, and contribute towards a healthy, drug-free & Viksit Bharat.', 800, 670);

    // Certificate ID & Date Pill Box
    ctx.fillStyle = '#fffbe8';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(460, 720, 680, 48, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 17px "Inter", monospace';
    const dateStr = new Date(submittedCert.created_at || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    ctx.fillText(`CERTIFICATE ID: ${submittedCert.certificate_id}   |   ISSUED: ${dateStr}`, 800, 751);

    // Footer Signatures - Directors
    // Left Signature - Lion Dr. R. Srinivas
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold italic 24px "Times New Roman", Georgia, serif';
    ctx.fillText('Lion Dr. R. Srinivas', 340, 915);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(220, 930);
    ctx.lineTo(460, 930);
    ctx.stroke();
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.fillText('Director', 340, 955);
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Sri Shree Vision Foundation', 340, 975);

    // Right Signature - Lion J. Indhyarani
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold italic 24px "Times New Roman", Georgia, serif';
    ctx.fillText('Lion J. Indhyarani', 1260, 915);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(1140, 930);
    ctx.lineTo(1380, 930);
    ctx.stroke();
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.fillText('Director', 1260, 955);
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Sri Shree Vision Foundation', 1260, 975);


    // Online Verification Footer Note
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px "Inter", sans-serif';
    ctx.fillText(`Verify authenticity online at: ngo-azure-zeta.vercel.app/verify-certificate?id=${submittedCert.certificate_id}`, 800, 1035);




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
    const text = encodeURIComponent(`I just took the Nasha Mukt YUVA Pledge for a Drug-Free India and earned my Certificate of Commitment! Take the pledge here: https://ngo-azure-zeta.vercel.app/nasha-mukt-pledge`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden border border-orange-500/30">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-100 uppercase tracking-widest border border-white/20">
                <Sparkles className="w-4 h-4 text-amber-300" /> Government & NGO Youth Drive
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Viksit & Nasha Mukt Yuva Initiative
              </h1>

              <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
                Stand against drug & substance abuse. Take the online pledge, empower youth across India, and immediately download your official <strong>Certificate of Commitment</strong> for free.
              </p>
            </div>

            {/* Live Counter Badge */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl text-center shrink-0 w-full sm:w-auto shadow-inner">
              <div className="flex items-center justify-center gap-2 text-amber-300 mb-1">
                <Users className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Live Pledge Count</span>
              </div>
              <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
                {pledgeCount.toLocaleString('en-IN')}+
              </div>
              <p className="text-xs text-amber-100 mt-1">Youth Pledged Nationwide</p>
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
                  <ShieldCheck className="w-5 h-5 text-orange-500" /> Why Take The Pledge?
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

              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-3xl shadow-lg space-y-3">
                <HeartHandshake className="w-8 h-8 text-amber-200" />
                <h4 className="text-lg font-bold">The Anti-Drug Affirmation</h4>
                <p className="text-xs text-amber-50 leading-relaxed italic">
                  "I promise to keep myself, my family, and my community free from addiction. I pledge to support those struggling with substance abuse and promote a healthy, energetic and Viksit Bharat."
                </p>
              </div>

              <div className="text-center p-4 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">Already took the pledge?</p>
                <Link to="/verify-certificate" className="inline-flex items-center text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline mt-1">
                  <QrCode className="w-3.5 h-3.5 mr-1" /> Search & Verify Certificate Online
                </Link>
              </div>
            </div>

            {/* Right Registration Form */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-orange-500" /> Delegate Registration Form
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
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Pledge Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-900 cursor-pointer">
                    <input
                      type="checkbox"
                      name="pledgeAgreed"
                      checked={formData.pledgeAgreed}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                    />
                    <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      I hereby take the <strong>Nasha Mukt YUVA Pledge</strong> to stay completely free from drugs & narcotics, spread awareness in my community, and contribute towards a healthy, drug-free nation.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !formData.pledgeAgreed}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-2xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
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
                style={{ width: '900px' }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleDownloadPNG}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 text-sm"
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
              <Link to={`/verify-certificate?id=${submittedCert.certificate_id}`} className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
                Verify Online
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
