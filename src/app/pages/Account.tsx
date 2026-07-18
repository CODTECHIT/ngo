import { usePublicAuth } from '../contexts/PublicAuthContext';
import { Navigate, Link } from 'react-router';
import { Loader2, User as UserIcon, Mail, LogOut, Phone, Calendar, MapPin, CheckCircle2, FileText } from 'lucide-react';
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
          registered_at,
          events (
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

      if (regData) {
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const processedRegistrations = regData.map((reg: any) => {
            if (!reg.events) {
              console.warn("Registration missing events data:", reg);
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
          
          setRegistrations(processedRegistrations as any);
        } catch (err) {
          console.error("Error processing registrations:", err);
          setRegistrations(regData as any); // fallback
        }
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
      
      const templateUrl = reg.events.certificate_template_url;
      if (!templateUrl) throw new Error("No template found");

      // 1. Fetch the PDF array buffer
      const response = await fetch(templateUrl);
      const existingPdfBytes = await response.arrayBuffer();

      // 2. Load the PDF document dynamically
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // 3. Get the first page
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      // 4. Draw text
      const nameText = profile.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Participant';
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      const nameWidth = helveticaBold.widthOfTextAtSize(nameText, 36);
      firstPage.drawText(nameText, {
        x: (width / 2) - (nameWidth / 2),
        y: (height / 2), // Approximate center
        size: 36,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      const eventText = reg.events.title;
      const eventWidth = helvetica.widthOfTextAtSize(eventText, 20);
      firstPage.drawText(eventText, {
        x: (width / 2) - (eventWidth / 2),
        y: (height / 2) - 40,
        size: 20,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.3),
      });

      const dateText = `Held on ${new Date(reg.events.event_date).toLocaleDateString()}`;
      const dateWidth = helvetica.widthOfTextAtSize(dateText, 16);
      firstPage.drawText(dateText, {
        x: (width / 2) - (dateWidth / 2),
        y: (height / 2) - 70,
        size: 16,
        font: helvetica,
        color: rgb(0.4, 0.4, 0.4),
      });

      // 5. Serialize and trigger download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Certificate_${nameText.replace(/\s+/g, '_')}_${eventText.replace(/\s+/g, '_')}.pdf`;
      link.click();
    } catch (err) {
      console.error("Error generating certificate:", err);
      alert("Failed to generate certificate. Please make sure the template is a valid PDF.");
    } finally {
      setDownloadingCert(null);
    }
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
                      <div className="shrink-0">
                        <StatusBadge status={reg.events.status as any} />
                        
                        {reg.events.status === 'completed' && reg.events.certificate_template_url && (
                          <div className="mt-3">
                            <button
                              onClick={() => handleDownloadCertificate(reg)}
                              disabled={downloadingCert === reg.id}
                              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
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

            <div className="bg-black/5 border border-black/5 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Saved Donations</h3>
              <p className="text-zinc-500 text-sm font-light">You have no saved donations yet. Make an impact today!</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
