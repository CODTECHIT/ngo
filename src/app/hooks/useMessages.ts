import { useState, useEffect } from 'react';
import { supabaseAdmin as supabase } from '../../lib/supabase';

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export function useMessages(forceRefresh = false) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Map new schema to the expected format
        const formattedData = data.map((msg: any) => ({
          ...msg,
          name: `${msg.fname || ''} ${msg.lname || ''}`.trim() || 'Anonymous',
          // Try to extract phone from message if it's there
          phone: msg.message?.match(/\[Phone: (.*?)\]/)?.[1] || '',
        }));
        setMessages(formattedData);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [forceRefresh]);

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: isRead })
        .eq('id', id);
      if (error) throw error;
      fetchMessages();
    } catch (err) {
      console.error("Error updating message status:", err);
    }
  };

  return { messages, loading, refetch: fetchMessages, markAsRead };
}
