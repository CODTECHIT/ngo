import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
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
    const randNum = Math.floor(10000 + Math.random() * 90000);
    const certId = `CERT-NETRA-2026-${randNum}`;

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

    // Set resolution (1600 x 1131 landscape)
    canvas.width = 1600;
    canvas.height = 1131;

    // Background Parchment (Cool Cyan/Teal Tint)
    const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1131);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.5, '#f0fdfa');
    bgGrad.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1600, 1131);

    // Official Double Border (Ocean Blue & Cyan)
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#0369a1'; // Deep Blue
    ctx.strokeRect(36, 36, 1528, 1059);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0891b2'; // Cyan
    ctx.strokeRect(54, 54, 1492, 1023);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(62, 62, 1476, 1007);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 0, 45, 5);
      ctx.fillRect(0, 0, 5, 45);
      ctx.restore();
    };
    drawCorner(74, 74, 0);
    drawCorner(1526, 74, 90);
    drawCorner(1526, 1057, 180);
    drawCorner(74, 1057, 270);

    // Top Cyan Accent Banner
    const triGrad = ctx.createLinearGradient(350, 0, 1250, 0);
    triGrad.addColorStop(0, '#0284c7');
    triGrad.addColorStop(0.5, '#ffffff');
    triGrad.addColorStop(1, '#0d9488');
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
      ctx.strokeStyle = '#0284c7';
      ctx.stroke();
    };

    // Fallback Logo Frame
    ctx.save();
    ctx.beginPath();
    ctx.arc(800, 150, 55, 0, 2 * Math.PI);
    ctx.fillStyle = '#e0f2fe';
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#0284c7';
    ctx.stroke();
    ctx.restore();

    // Organization Header Text
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 30px "Times New Roman", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('SRI SHREE VISION FOUNDATION', 800, 242);

    ctx.fillStyle = '#475569';
    ctx.font = '500 16px "Inter", sans-serif';
    ctx.fillText('Netra Suraksha Abhiyaan  |  Eye Care & Vision Protection Initiative', 800, 272);

    // Divider Line
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(350, 300);
    ctx.lineTo(680, 300);
    ctx.moveTo(920, 300);
    ctx.lineTo(1250, 300);
    ctx.stroke();

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 18px Georgia, serif';
    ctx.fillText('👁️ NETRA SURAKSHA PLEDGE 👁️', 800, 305);

    // Main Certificate Title
    ctx.fillStyle = '#0c4a6e';
    ctx.font = 'bold 46px "Times New Roman", Georgia, serif';
    ctx.fillText('CERTIFICATE OF COMMITMENT', 800, 375);

    // Body Text
    ctx.fillStyle = '#334155';
    ctx.font = '500 22px Georgia, "Times New Roman", serif';
    ctx.fillText('This is to proudly certify that', 800, 440);

    // Recipient Name
    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold italic 50px "Times New Roman", Georgia, serif';
    ctx.fillText(submittedCert.full_name, 800, 515);

    // Underline
    const nameWidth = ctx.measureText(submittedCert.full_name).width;
    ctx.strokeStyle = '#0284c7';
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

    // Affirmation Statement
    ctx.fillStyle = '#1e293b';
    ctx.font = 'italic 20px "Times New Roman", Georgia, serif';
    ctx.fillText('has solemnly taken the Netra Suraksha Pledge, committing to practice regular eye care,', 800, 638);
    ctx.fillText('prevent avoidable blindness, and spread eye donation awareness for a brighter India.', 800, 670);

    // Certificate ID Box
    ctx.fillStyle = '#f0fdfa';
    ctx.strokeStyle = '#0d9488';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(460, 720, 680, 48, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f766e';
    ctx.font = 'bold 17px "Inter", monospace';
    const dateStr = new Date(submittedCert.created_at || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    ctx.fillText(`CERTIFICATE ID: ${submittedCert.certificate_id}   |   ISSUED: ${dateStr}`, 800, 751);

    // Footer Signatures
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


    // Online Verification Note
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
                style={{ width: '900px' }}
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
