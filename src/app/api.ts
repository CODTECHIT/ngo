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
  }
};
