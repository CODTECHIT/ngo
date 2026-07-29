import { useState, useEffect } from 'react';
import { supabaseAdmin as supabase } from '../../lib/supabase';

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

const LOCAL_KEY = 'ngo_saved_messages';

export function useMessages(forceRefresh = false) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      let dbMessages: ContactMessage[] = [];
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          dbMessages = data.map((msg: any) => ({
            ...msg,
            name: `${msg.fname || ''} ${msg.lname || ''}`.trim() || msg.name || 'Anonymous',
            phone: msg.phone || msg.message?.match(/\[Phone: (.*?)\]/)?.[1] || '',
          }));
        }
      } catch (err) {
        console.warn("Error fetching messages from DB, using fallback:", err);
      }

      // Read local storage messages
      let localMessages: ContactMessage[] = [];
      try {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          localMessages = parsed.map((msg: any) => ({
            id: msg.id || 'local_' + Math.random(),
            name: `${msg.fname || ''} ${msg.lname || ''}`.trim() || msg.name || 'Anonymous',
            email: msg.email || '',
            phone: msg.phone || '',
            subject: msg.subject || '',
            message: msg.message || '',
            is_read: msg.is_read || false,
            created_at: msg.created_at || new Date().toISOString()
          }));
        }
      } catch (e) {}

      // Combine DB + Local messages avoiding duplicate IDs
      const combinedMap = new Map<string, ContactMessage>();
      dbMessages.forEach(m => combinedMap.set(m.id, m));
      localMessages.forEach(m => {
        if (!combinedMap.has(m.id)) {
          combinedMap.set(m.id, m);
        }
      });

      const result = Array.from(combinedMap.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setMessages(result);
    } catch (err) {
      console.error("Error in useMessages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [forceRefresh]);

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: isRead })
        .eq('id', id);
    } catch (err) {
      console.warn("DB markAsRead warning:", err);
    }

    try {
      const stored = localStorage.getItem(LOCAL_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);
        parsed = parsed.map((m: any) => m.id === id ? { ...m, is_read: isRead } : m);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
      }
    } catch (e) {}

    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: isRead } : m));
  };

  return { messages, loading, refetch: fetchMessages, markAsRead };
}
