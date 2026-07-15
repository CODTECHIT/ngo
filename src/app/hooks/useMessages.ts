import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

// Simple in-memory cache
let cachedMessages: ContactMessage[] | null = null;
let fetchPromise: Promise<ContactMessage[] | null> | null = null;

export function useMessages(forceRefresh = false) {
  const [messages, setMessages] = useState<ContactMessage[]>(cachedMessages || []);
  const [loading, setLoading] = useState(!cachedMessages);

  const fetchMessages = async (ignoreCache = false) => {
    try {
      if (ignoreCache) {
        setLoading(true);
      } else if (cachedMessages) {
        setLoading(false);
        return;
      }

      if (!fetchPromise || ignoreCache) {
        fetchPromise = supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
          .then(({ data }) => data);
      }
      
      const data = await fetchPromise;
      if (data) {
        cachedMessages = data;
        setMessages(data);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(forceRefresh);
  }, [forceRefresh]);

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read: isRead })
        .eq('id', id);
      if (error) throw error;
      fetchMessages(true);
    } catch (err) {
      console.error("Error updating message status:", err);
    }
  };

  return { messages, loading, refetch: () => fetchMessages(true), markAsRead };
}
