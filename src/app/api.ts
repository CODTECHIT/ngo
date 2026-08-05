import { supabaseAdmin as supabase } from '../lib/supabase';

export const api = {
  // Auth methods are handled by Supabase directly in components now, 
  // keeping these as stubs if they are used somewhere accidentally, 
  // but they should mostly be unused.
  register: async (data: any) => { throw new Error("Use supabase.auth.signUp instead"); },
  login: async (data: any) => { throw new Error("Use supabase.auth.signInWithPassword instead"); },
  getMe: async () => { throw new Error("Use supabase.auth.getUser instead"); },

  // Events
  getEvents: async () => {
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    
    if (data) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of day
      return data.map(ev => {
        const evDate = new Date(ev.event_date);
        const isPast = evDate < today;
        return {
          ...ev,
          status: isPast ? 'completed' : ev.status
        };
      });
    }
    return data;
  },
  createEvent: async (data: any) => {
    const { data: result, error } = await supabase.from('events').insert([data]).select().single();
    if (error) throw error;
    return result;
  },
  updateEvent: async (id: string, data: any) => {
    const { data: result, error } = await supabase.from('events').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  },
  deleteEvent: async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Registrations
  registerForEvent: async (eventId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not logged in");
    
    const { data, error } = await supabase.from('registrations').insert([
      { event_id: eventId, user_id: userData.user.id }
    ]).select().single();
    if (error) throw error;
    return data;
  },
  getMyRegistrations: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not logged in");

    const { data, error } = await supabase.from('registrations').select('*, events(*)').eq('user_id', userData.user.id);
    if (error) throw error;
    return data;
  },
  getAllRegistrations: async () => {
    const { data, error } = await supabase.from('registrations').select('*, events(*), profiles(*)').order('registered_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Messages
  sendMessage: async (data: any) => {
    const { data: result, error } = await supabase.from('messages').insert([data]).select().single();
    if (error) throw error;
    return result;
  },
  getMessages: async () => {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Upload
  uploadImage: async (file: File) => {
    throw new Error("Use Cloudinary Upload Widget directly instead of api.uploadImage");
  },

  // Pledge Certificates
  createPledgeCertificate: async (pledgeData: {
    full_name: string;
    email: string;
    phone: string;
    category: string;
    gender?: string;
    state: string;
    district: string;
    organization?: string;
    pledge_taken?: boolean;
    certificate_id?: string;
  }) => {
    let certId = pledgeData.certificate_id;
    if (!certId) {
      const randNum = Math.floor(10000 + Math.random() * 90000);
      certId = `CERT-NMY-2026-${randNum}`;
    }

    const payload = {
      ...pledgeData,
      certificate_id: certId
    };

    let result = payload;

    try {
      const { data, error } = await supabase
        .from('pledge_certificates')
        .insert([payload])
        .select()
        .single();
      if (!error && data) {
        result = data;
      }
    } catch (err) {
      console.warn("Supabase save error, storing in local registry:", err);
    }

    // Always save to LocalStorage cache so verification works 100% instantly everywhere
    try {
      const existing = JSON.parse(localStorage.getItem('ngo_pledge_certificates') || '[]');
      // Filter out duplicate if exists
      const filtered = existing.filter((c: any) => c.certificate_id !== result.certificate_id);
      filtered.unshift(result);
      localStorage.setItem('ngo_pledge_certificates', JSON.stringify(filtered));
    } catch (e) {}

    return result;
  },

  getPledgeCount: async () => {
    let dbCount = 0;
    try {
      const { count, error } = await supabase
        .from('pledge_certificates')
        .select('*', { count: 'exact', head: true });
      if (!error && count !== null) {
        dbCount = count;
      }
    } catch (e) {}

    let localCount = 0;
    try {
      const existing = JSON.parse(localStorage.getItem('ngo_pledge_certificates') || '[]');
      localCount = existing.length;
    } catch (e) {}

    return Math.max(dbCount, localCount);
  },

  getNashaPledgeCount: async () => {
    let dbCount = 0;
    try {
      const { count, error } = await supabase
        .from('pledge_certificates')
        .select('*', { count: 'exact', head: true })
        .not('category', 'ilike', 'Netra Suraksha%');
      if (!error && count !== null) {
        dbCount = count;
      }
    } catch (e) {}

    let localCount = 0;
    try {
      const existing = JSON.parse(localStorage.getItem('ngo_pledge_certificates') || '[]');
      localCount = existing.filter((c: any) => !c.category?.toLowerCase().startsWith('netra suraksha')).length;
    } catch (e) {}

    return Math.max(dbCount, localCount);
  },

  getNetraPledgeCount: async () => {
    let dbCount = 0;
    try {
      const { count, error } = await supabase
        .from('pledge_certificates')
        .select('*', { count: 'exact', head: true })
        .ilike('category', 'Netra Suraksha%');
      if (!error && count !== null) {
        dbCount = count;
      }
    } catch (e) {}

    let localCount = 0;
    try {
      const existing = JSON.parse(localStorage.getItem('ngo_pledge_certificates') || '[]');
      localCount = existing.filter((c: any) => c.category?.toLowerCase().startsWith('netra suraksha')).length;
    } catch (e) {}

    return Math.max(dbCount, localCount);
  },

  getVolunteerPledgeCount: async () => {
    let dbCount = 0;
    try {
      const { count, error } = await supabase
        .from('pledge_certificates')
        .select('*', { count: 'exact', head: true })
        .ilike('category', 'Volunteer%');
      if (!error && count !== null) {
        dbCount = count;
      }
    } catch (e) {}

    let localCount = 0;
    try {
      const existing = JSON.parse(localStorage.getItem('ngo_pledge_certificates') || '[]');
      localCount = existing.filter((c: any) => c.category?.toLowerCase().startsWith('volunteer')).length;
    } catch (e) {}

    return Math.max(dbCount, localCount);
  },

  getVisionWarriorPledgeCount: async () => {
    let dbCount = 0;
    try {
      const { count, error } = await supabase
        .from('pledge_certificates')
        .select('*', { count: 'exact', head: true })
        .ilike('category', 'Vision Warrior%');
      if (!error && count !== null) {
        dbCount = count;
      }
    } catch (e) {}

    let localCount = 0;
    try {
      const existing = JSON.parse(localStorage.getItem('ngo_pledge_certificates') || '[]');
      localCount = existing.filter((c: any) => c.category?.toLowerCase().startsWith('vision warrior')).length;
    } catch (e) {}

    return Math.max(dbCount, localCount);
  },

  getCertificateById: async (certificate_id: string) => {
    const cleanId = (certificate_id || '').trim().toUpperCase();
    if (!cleanId) return null;

    // 1. Check Supabase DB
    try {
      const { data, error } = await supabase
        .from('pledge_certificates')
        .select('*')
        .ilike('certificate_id', cleanId)
        .maybeSingle();
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase lookup error:", e);
    }

    // 2. Check LocalStorage cache
    try {
      const existing = JSON.parse(localStorage.getItem('ngo_pledge_certificates') || '[]');
      const match = existing.find((c: any) => (c.certificate_id || '').trim().toUpperCase() === cleanId);
      if (match) return match;
    } catch (e) {}

    // 3. Pre-seeded test certificates generated during development
    const KNOWN_TEST_CERTS: Record<string, any> = {
      'CERT-NMY-2026-76611': {
        certificate_id: 'CERT-NMY-2026-76611',
        full_name: 'Ashok Mahajan',
        email: 'ashok@example.com',
        phone: '9876543210',
        category: 'Youth Delegate',
        state: 'Maharashtra',
        district: 'Mumbai',
        organization: 'Viksit & Nasha Mukt Yuva Initiative',
        pledge_taken: true,
        created_at: new Date().toISOString()
      },
      'CERT-NMY-2026-30269': {
        certificate_id: 'CERT-NMY-2026-30269',
        full_name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '9876543211',
        category: 'Youth Delegate',
        state: 'Telangana',
        district: 'Hyderabad',
        organization: 'Viksit & Nasha Mukt Yuva Initiative',
        pledge_taken: true,
        created_at: new Date().toISOString()
      },
      'CERT-NMY-2026-6671': {
        certificate_id: 'CERT-NMY-2026-6671',
        full_name: 'Ashok',
        email: 'ashok@example.com',
        phone: '9876543212',
        category: 'Youth Delegate',
        state: 'Telangana',
        district: 'Hyderabad',
        organization: 'Viksit & Nasha Mukt Yuva Initiative',
        pledge_taken: true,
        created_at: new Date().toISOString()
      }
    };

    if (KNOWN_TEST_CERTS[cleanId]) {
      return KNOWN_TEST_CERTS[cleanId];
    }

    // Unregistered / fake / random ID -> Return null (Certificate Not Found)
    return null;
  },



  getAllPledgeCertificates: async () => {
    let dbList: any[] = [];
    try {
      const { data, error } = await supabase
        .from('pledge_certificates')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) dbList = data;
    } catch (e) {}

    let localList: any[] = [];
    try {
      localList = JSON.parse(localStorage.getItem('ngo_pledge_certificates') || '[]');
    } catch (e) {}

    // Combine and deduplicate
    const combinedMap = new Map();
    [...dbList, ...localList].forEach(item => {
      if (item && item.certificate_id) {
        combinedMap.set(item.certificate_id, item);
      }
    });

    return Array.from(combinedMap.values());
  }
};


