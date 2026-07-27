import { usePublicAuth } from '../contexts/PublicAuthContext';
import { Navigate, Link } from 'react-router';
import { Loader2, User as UserIcon, Mail, LogOut, Phone, Calendar, MapPin, CheckCircle2, FileText, Heart, Sparkles } from 'lucide-react';
import { SectionLabel, StatusBadge } from '../components/Layout';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type UserProfile = {
  full_name: string;
  phone: string;
};

type EventRegistration = {
  id: string;
  registered_at: string;
  events: {
    title: string;
    event_date: string;
    location: string;
    status: string;
    certificate_template_url?: string;
  };
};

export default function Account() {
  const { user, loading, logout } = usePublicAuth();

  const [profile, setProfile] = useState<UserProfile>({ full_name: '', phone: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [downloadingCert, setDownloadingCert] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoadingData(true);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('users_profile')
        .select('full_name, phone')
        .eq('id', user.id)
        .single();
        
      if (profileData) {
        setProfile({
          full_name: profileData.full_name || '',
          phone: profileData.phone || ''
        });
      }

      // Fetch registrations
      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .select(`
          id,
          event_id,
          user_id,
          registered_at,
          events (
            id,
            title,
            event_date,
            location,
            status,
            certificate_template_url
          )
        `)
        .eq('user_id', user.id)
        .order('registered_at', { ascending: false });

      console.log('Account.tsx fetch registrations:', { regData, regError, userId: user.id });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dbProcessed = (regData || []).map((reg: any) => {
        if (!reg.events) {
          return { ...reg, events: { title: 'Unknown', event_date: new Date().toISOString(), status: 'unknown' } };
        }
        const evDate = new Date(reg.events.event_date);
        const isPast = evDate < today;
        return {
          ...reg,
          events: {
            ...reg.events,
            status: isPast ? 'completed' : reg.events.status
          }
        };
      });

      // Filter local storage registrations specifically for this logged-in user
      let userLocalRegs: any[] = [];
      try {
        const rawLocalRegs = JSON.parse(localStorage.getItem('ngo_saved_registrations') || '[]');
        userLocalRegs = rawLocalRegs.filter((item: any) => 
          (item.user_id && item.user_id === user.id) || 
          (item.email && user.email && item.email.toLowerCase() === user.email.toLowerCase())
        );
      } catch {}

      const combinedRegs = [...dbProcessed, ...userLocalRegs];
      // Map deduplication by unique event identifier (title or event_id)
      const uniqueRegsMap = new Map();
      for (const item of combinedRegs) {
        const key = (item.event_id || item.events?.id || item.events?.title || item.id || '').toString().toLowerCase().trim();
        if (key && !uniqueRegsMap.has(key)) {
          uniqueRegsMap.set(key, item);
        }
      }
      setRegistrations(Array.from(uniqueRegsMap.values()) as any);

      // Fetch donations
      try {
        const { data: dbDonations } = await supabase.from('donations').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        
        let userLocalDonations: any[] = [];
        try {
          const rawLocalDons = JSON.parse(localStorage.getItem('ngo_saved_donations') || '[]');
          userLocalDonations = rawLocalDons.filter((item: any) => 
            (item.user_id && item.user_id === user.id) || 
            (item.email && user.email && item.email.toLowerCase() === user.email.toLowerCase())
          );
        } catch {}

        const combinedDonations = [...(dbDonations || []), ...userLocalDonations];
        const uniqueDonsMap = new Map();
        for (const item of combinedDonations) {
          const key = item.payment_id || item.id || `${item.cause}-${item.amount}-${item.created_at}`;
          if (key && !uniqueDonsMap.has(key)) {
            uniqueDonsMap.set(key, item);
          }
        }
        setDonations(Array.from(uniqueDonsMap.values()));
      } catch {
        const rawLocalDons = JSON.parse(localStorage.getItem('ngo_saved_donations') || '[]');
        const userLocalDonations = rawLocalDons.filter((item: any) => 
          (item.user_id && item.user_id === user.id) || 
          (item.email && user.email && item.email.toLowerCase() === user.email.toLowerCase())
        );
        setDonations(userLocalDonations);
      }

      setLoadingData(false);
    };

    fetchData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileMessage({ type: '', text: '' });

    const { error } = await supabase
      .from('users_profile')
      .update({
        full_name: profile.full_name,
        phone: profile.phone
      })
      .eq('id', user.id);

    if (error) {
      setProfileMessage({ type: 'error', text: error.message });
    } else {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    }
    
    setSavingProfile(false);
  };

  const handleDownloadCertificate = async (reg: EventRegistration) => {
    try {
      setDownloadingCert(reg.id);
      
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      let pdfDoc: any = null;
      let firstPage: any = null;
      let width = 842;
      let height = 595;

      const templateUrl = reg.events.certificate_template_url;
      const nameText = profile.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Participant';
      const eventText = reg.events.title || 'Special Event';
      const eventDateStr = reg.events.event_date ? new Date(reg.events.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent Event';

      let loadedFromTemplate = false;

      if (templateUrl) {
        const cleanUrl = templateUrl.trim();
        const rawCandidateUrls: string[] = [];

        if (cleanUrl.includes('cloudinary.com')) {
          if (cleanUrl.includes('/image/upload/')) {
            // Put PNG and JPG image transformations FIRST for instant 0.1s loading without 401 errors
            rawCandidateUrls.push(cleanUrl.replace(/\.pdf$/i, '.png'));
            rawCandidateUrls.push(cleanUrl.replace(/\.pdf$/i, '.jpg'));
            rawCandidateUrls.push(cleanUrl.replace('/image/upload/', '/image/upload/pg_1,f_png/'));
            rawCandidateUrls.push(cleanUrl);
          } else if (cleanUrl.includes('/raw/upload/')) {
            rawCandidateUrls.push(cleanUrl.replace('/raw/upload/', '/image/upload/pg_1,f_png/'));
            rawCandidateUrls.push(cleanUrl.replace('/raw/upload/', '/image/upload/'));
            rawCandidateUrls.push(cleanUrl);
          } else {
            rawCandidateUrls.push(cleanUrl);
          }
        } else {
          rawCandidateUrls.push(cleanUrl);
        }

        const candidateUrls: string[] = [];
        for (const item of rawCandidateUrls) {
          candidateUrls.push(item);
          candidateUrls.push(`https://corsproxy.io/?${encodeURIComponent(item)}`);
        }

        const uniqueCandidates = Array.from(new Set(candidateUrls));
        let bytes: ArrayBuffer | null = null;

        for (const candidateUrl of uniqueCandidates) {
          try {
            const response = await fetch(candidateUrl);
            if (response.ok) {
              const resBuffer = await response.arrayBuffer();
              if (resBuffer && resBuffer.byteLength > 0) {
                // Verify response is not an HTML error string
                const checkHeader = new Uint8Array(resBuffer.slice(0, 5));
                const isHtml = checkHeader[0] === 0x3C; // '<' character (<!DOCTYPE)
                if (!isHtml) {
                  bytes = resBuffer;
                  console.log("Successfully loaded certificate template from:", candidateUrl);
                  break;
                }
              }
            }
          } catch (e) {
            console.warn("Attempt failed for candidate URL:", candidateUrl, e);
          }
        }

        if (bytes) {
          try {
            const header = new Uint8Array(bytes.slice(0, 4));
            const isPdfBytes = header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46; // %PDF

            if (isPdfBytes) {
              pdfDoc = await PDFDocument.load(bytes);
              const pages = pdfDoc.getPages();
              firstPage = pages[0];
              const size = firstPage.getSize();
              width = size.width;
              height = size.height;
              loadedFromTemplate = true;
            } else {
              // Try embedding as PNG or JPG
              pdfDoc = await PDFDocument.create();
              let embeddedImage: any = null;
              try {
                embeddedImage = await pdfDoc.embedPng(bytes);
              } catch {
                try {
                  embeddedImage = await pdfDoc.embedJpg(bytes);
                } catch {
                  embeddedImage = null;
                }
              }

              if (embeddedImage) {
                width = embeddedImage.width;
                height = embeddedImage.height;
                firstPage = pdfDoc.addPage([width, height]);
                firstPage.drawImage(embeddedImage, { x: 0, y: 0, width, height });
                loadedFromTemplate = true;
              }
            }
          } catch (parseErr) {
            console.error("Error parsing downloaded template bytes:", parseErr);
          }
        }
      }

      if (!loadedFromTemplate) {
        alert("Certificate will get soon! The event admin has not published the template yet.");
        setDownloadingCert(null);
        return;
      }

      if (loadedFromTemplate && firstPage && pdfDoc) {
        const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
        const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const navyColor = rgb(0.08, 0.22, 0.42); // Elegant Deep Navy
        const goldColor = rgb(0.83, 0.68, 0.21); // Accent Gold
        const grayColor = rgb(0.28, 0.28, 0.28); // Dark Charcoal Gray
        const subGrayColor = rgb(0.4, 0.4, 0.4); // Medium Gray

        // Dynamic scale factor relative to a standard 842pt landscape canvas
        const scale = width / 842;

        // 1. Participant Name (Refined, Executive Times-Roman Serif)
        const nameFontSize = Math.round(32 * scale);
        const nameWidth = timesBold.widthOfTextAtSize(nameText, nameFontSize);
        firstPage.drawText(nameText, {
          x: (width / 2) - (nameWidth / 2),
          y: height * 0.525,
          size: nameFontSize,
          font: timesBold,
          color: navyColor,
        });

        // Gold Underline beneath name (proportional length & thickness)
        const lineHalfWidth = Math.max((nameWidth / 2) + (35 * scale), 140 * scale);
        firstPage.drawLine({
          start: { x: (width / 2) - lineHalfWidth, y: height * 0.50 },
          end: { x: (width / 2) + lineHalfWidth, y: height * 0.50 },
          thickness: Math.max(1.8 * scale, 1.5),
          color: goldColor,
        });

        // 2. Official Wording Line 1
        const wording1 = "for their valuable participation and dedicated contribution in the event";
        const w1Size = Math.round(13 * scale);
        const w1Width = timesItalic.widthOfTextAtSize(wording1, w1Size);
        firstPage.drawText(wording1, {
          x: (width / 2) - (w1Width / 2),
          y: height * 0.445,
          size: w1Size,
          font: timesItalic,
          color: grayColor,
        });

        // 3. Event Title (Bold, Highlighted, Proportional)
        const evFontSize = Math.round(22 * scale);
        const evWidth = helveticaBold.widthOfTextAtSize(eventText, evFontSize);
        firstPage.drawText(eventText, {
          x: (width / 2) - (evWidth / 2),
          y: height * 0.375,
          size: evFontSize,
          font: helveticaBold,
          color: navyColor,
        });

        // 4. Official Wording Line 2
        const wording2 = "organized by Srishreevision Foundation, in recognition of their sincere effort towards community welfare.";
        const w2Size = Math.round(10.5 * scale);
        const w2Width = timesItalic.widthOfTextAtSize(wording2, w2Size);
        firstPage.drawText(wording2, {
          x: (width / 2) - (w2Width / 2),
          y: height * 0.32,
          size: w2Size,
          font: timesItalic,
          color: subGrayColor,
        });

        // 5. Date Line (Bottom-Left, matching signature scale)
        const dateText = `DATE: ${eventDateStr}`;
        const dateFontSize = Math.round(10 * scale);
        firstPage.drawText(dateText, {
          x: width * 0.08,
          y: height * 0.17,
          size: dateFontSize,
          font: helveticaBold,
          color: rgb(0.25, 0.25, 0.25),
        });

        // Underline beneath date
        firstPage.drawLine({
          start: { x: width * 0.08, y: height * 0.155 },
          end: { x: width * 0.25, y: height * 0.155 },
          thickness: Math.max(1.2 * scale, 1),
          color: rgb(0.7, 0.7, 0.7),
        });
        // Serialize & Download
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Certificate_${nameText.replace(/\s+/g, '_')}_${eventText.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();

        // Record Certificate Download & Participation Status in Database & LocalStorage
        const participatedAt = new Date().toISOString();
        try {
          await supabase.from('registrations').update({
            status: 'participated',
            certificate_issued: true,
            participated_at: participatedAt
          }).eq('id', reg.id);
        } catch (dbErr) {
          console.warn('Could not update DB registration participation status:', dbErr);
        }

        try {
          const past = JSON.parse(localStorage.getItem('ngo_saved_registrations') || '[]');
          const updatedPast = past.map((r: any) => {
            if (r.id === reg.id || (r.event_id === reg.events?.id && (r.email === user?.email || r.user_id === user?.id))) {
              return { ...r, status: 'participated', certificate_issued: true, participated_at: participatedAt };
            }
            return r;
          });
          localStorage.setItem('ngo_saved_registrations', JSON.stringify(updatedPast));
        } catch {}

        setRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, status: 'participated', certificate_issued: true, participated_at: participatedAt } : r));
        window.dispatchEvent(new Event('ngo_registration_updated'));
      } else {
        alert("Could not initialize certificate canvas. Please try again.");
      }
    } catch (err) {
      console.error("Error generating certificate:", err);
      alert("An error occurred while generating the certificate. Please try again.");
    } finally {
      setDownloadingCert(null);
    }
  };

  const handleDownload80GInvoice = (don: any) => {
    const printWin = window.open('', '_blank', 'width=800,height=900');
    if (!printWin) return;
    const dateStr = don.created_at ? new Date(don.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' });
    const donorName = profile.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Valued Donor';
    
    printWin.document.write(`
      <html>
        <head>
          <title>Official 80G Tax Invoice - ${don.payment_id || don.transaction_id || don.transactionId || don.id}</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; background: #f8fafc; color: #1e293b; }
            .card { max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            .header { background: #0F6E6E; color: white; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px; }
            .header h1 { margin: 0; font-size: 24px; font-family: 'Playfair Display', serif; }
            .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.9; }
            .field { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #cbd5e1; font-size: 14px; }
            .total { font-size: 20px; font-weight: 800; color: #0F6E6E; }
            .badge { background: #f0fdfa; border-left: 4px solid #0F6E6E; padding: 12px 16px; margin-top: 24px; border-radius: 6px; font-size: 12px; color: #0f766e; }
            .btn { display: inline-block; margin-top: 24px; background: #0F6E6E; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 13px; cursor: pointer; border: none; }
            @media print { .btn { display: none; } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>Srishree Vision Foundation</h1>
              <p>Registered NGO under Section 80G of Income Tax Act</p>
            </div>
            <h2>Official 80G Tax Receipt & Invoice</h2>
            <p>Received with thanks from <strong>${donorName}</strong> (${don.email || user?.email})</p>

            <div class="field"><span>Receipt / TXN ID:</span><strong>${don.payment_id || don.transaction_id || don.transactionId || 'INV-' + don.id}</strong></div>
            <div class="field"><span>Date & Time:</span><strong>${dateStr}</strong></div>
            <div class="field"><span>Cause / Purpose:</span><strong>${don.cause || 'General NGO Donation'}</strong></div>
            <div class="field"><span>Total Donated Amount:</span><strong class="total">₹${Number(don.amount).toLocaleString('en-IN')}</strong></div>

            <div class="badge">
              <strong>🎯 Eligible for 50% Tax Deduction</strong><br/>
              Donations to Srishree Vision Foundation qualify for deduction under Section 80G of the Income Tax Act.
            </div>

            <button class="btn" onclick="window.print()">Print / Download PDF</button>
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Redirect to login if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const defaultName = user.user_metadata?.full_name || user.user_metadata?.name || 'User';

  return (
    <div className="min-h-[80vh] flex items-start justify-center bg-background px-6 py-12 md:py-24">
      <div className="w-full max-w-5xl">
        <div className="mb-12">
          <SectionLabel>Your Profile</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mt-2">Account Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1 space-y-6">
            <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-xl text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt={defaultName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <UserIcon size={40} />
                )}
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-1">{profile.full_name || defaultName}</h2>
              <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm mb-8">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold py-3 px-4 rounded-xl transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
            
            {/* Profile Edit Form */}
            <div className="bg-black/5 border border-black/5 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-zinc-900 mb-4">Edit Details</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <UserIcon size={16} />
                    </div>
                    <input 
                      type="text" 
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary transition-colors"
                      placeholder="Your name" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Phone size={16} />
                    </div>
                    <input 
                      type="text" 
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary transition-colors"
                      placeholder="+1 (555) 000-0000" 
                    />
                  </div>
                </div>
                
                {profileMessage.text && (
                  <div className={`text-xs p-2 rounded-lg ${profileMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'} flex items-center gap-2`}>
                    {profileMessage.type === 'success' && <CheckCircle2 size={14} />}
                    {profileMessage.text}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2.5 px-4 rounded-xl transition-all disabled:opacity-50 text-sm"
                >
                  {savingProfile ? <Loader2 className="animate-spin" size={16} /> : "Save Changes"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 space-y-6">
            
            <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <Calendar className="text-primary" /> 
                My Event Registrations
              </h3>
              
              {registrations.length === 0 ? (
                <div className="text-center py-12 bg-black/5 rounded-2xl border border-dashed border-black/10">
                  <p className="text-zinc-500 font-medium mb-4">You haven't registered for any upcoming events.</p>
                  <Link to="/events" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-primary/90 transition-colors">
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map((reg) => (
                    <div key={reg.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-black/5 bg-black/[0.02] hover:bg-black/[0.04] transition-colors">
                      <div>
                        <h4 className="font-bold text-zinc-900 text-lg">{reg.events.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-zinc-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-primary" />
                            {new Date(reg.events.event_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-accent" />
                            {reg.events.location}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <StatusBadge status={reg.events.status as any} />
                        
                        {(reg.status === 'participated' || reg.certificate_issued) && (
                          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-sm">
                            🎓 Certificate Awarded & Participated
                          </span>
                        )}
                        
                        {(reg.events.status === 'completed' || reg.status === 'participated' || reg.certificate_issued) && (
                          <div className="mt-2 w-full">
                            <button
                              onClick={() => handleDownloadCertificate(reg)}
                              disabled={downloadingCert === reg.id}
                              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold bg-primary text-white hover:bg-primary/90 px-3.5 py-2 rounded-xl transition-all shadow-sm disabled:opacity-50"
                            >
                              {downloadingCert === reg.id ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                              {downloadingCert === reg.id ? 'Generating...' : 'Download Certificate'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                  <Heart className="text-red-500 fill-red-500" /> Saved Donations & 80G Receipts
                </h3>
                <Link to="/donate" className="text-xs font-bold bg-[#0F6E6E] text-white px-4 py-2 rounded-xl hover:bg-[#0c5959] transition-colors shadow-sm flex items-center gap-1">
                  <Sparkles size={14} /> Make New Donation
                </Link>
              </div>

              {donations.length === 0 ? (
                <div className="text-center py-12 bg-black/5 rounded-2xl border border-dashed border-black/10">
                  <p className="text-zinc-500 font-medium mb-4">You have no saved donations yet. Make a transformational impact today!</p>
                  <Link to="/donate" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0F6E6E] to-[#4CAF50] text-white font-bold py-2.5 px-6 rounded-xl hover:opacity-95 transition-all shadow-md">
                    Donate Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {donations.map((don: any) => (
                    <div key={don.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            80G Exempt
                          </span>
                          <span className="text-xs text-zinc-400">
                            {new Date(don.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                          </span>
                        </div>
                        <h4 className="font-bold text-zinc-900 text-lg mt-1">{don.cause}</h4>
                        <div className="text-xs font-mono text-zinc-500 mt-0.5">TXN: {don.payment_id}</div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                        <div className="text-2xl font-extrabold text-[#0F6E6E]">₹{Number(don.amount).toLocaleString('en-IN')}</div>
                        <button
                          onClick={() => handleDownload80GInvoice(don)}
                          className="flex items-center gap-1.5 text-xs font-bold bg-[#0F6E6E] text-white hover:bg-[#0c5959] px-3.5 py-2 rounded-xl transition-all shadow-sm"
                        >
                          <FileText size={14} className="text-emerald-300" /> Download 80G Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
