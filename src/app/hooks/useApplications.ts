import { useState, useEffect } from 'react';
import { supabaseAdmin as supabase } from '../../lib/supabase';

export type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  service: string;
  message: string;
  status: string;
  is_read: boolean;
  created_at: string;
};

const LOCAL_KEY = 'ngo_saved_applications';
const READ_OVERRIDES_KEY = 'ngo_applications_read_overrides';

function getReadOverrides(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(READ_OVERRIDES_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function setReadOverride(id: string, isRead: boolean) {
  try {
    const overrides = getReadOverrides();
    overrides[id] = isRead;
    localStorage.setItem(READ_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (e) {}
}

export function useApplications(forceRefresh = false) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      let dbApps: Application[] = [];
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          dbApps = data as Application[];
        }
      } catch (err) {
        console.warn("Error fetching applications from DB, using fallback:", err);
      }

      // Fallback: applications that were stored in the messages table when the
      // applications table wasn't ready yet (subject prefixed with "[App] ").
      let fallbackApps: Application[] = [];
      try {
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (!msgError && msgData) {
          fallbackApps = msgData
            .filter((m: any) => m.subject && m.subject.startsWith('[App] '))
            .map((m: any) => {
              const category = m.subject.replace(/^\[App\]\s*/, '').trim();
              const service = m.message?.match(/^Service:\s*(.*)$/m)?.[1]?.trim() || '';
              const phone = m.message?.match(/^Phone:\s*(.*)$/m)?.[1]?.trim() || '';
              const city = m.message?.match(/^City:\s*(.*)$/m)?.[1]?.trim() || '';
              const note = (m.message || '')
                .replace(/^(Category|Service|Phone|City):.*\n?/gm, '')
                .replace(/^\n+/, '')
                .trim();
              return {
                id: 'msg_' + m.id,
                full_name: `${m.fname || ''} ${m.lname || ''}`.trim() || 'Unknown',
                email: m.email || '',
                phone: phone === 'N/A' ? '' : phone,
                city: city === 'N/A' ? '' : city,
                category,
                service,
                message: note,
                status: 'pending',
                is_read: m.is_read || false,
                created_at: m.created_at,
              };
            });
        }
      } catch (err) {
        console.warn("Error fetching fallback applications from messages:", err);
      }

      let localApps: Application[] = [];
      try {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) {
          localApps = JSON.parse(stored).map((a: any) => ({
            id: a.id || 'local_app_' + Math.random(),
            full_name: a.full_name || '',
            email: a.email || '',
            phone: a.phone || '',
            city: a.city || '',
            category: a.category || 'volunteer',
            service: a.service || '',
            message: a.message || '',
            status: a.status || 'pending',
            is_read: a.is_read || false,
            created_at: a.created_at || new Date().toISOString(),
          }));
        }
      } catch (e) {}

      const combinedMap = new Map<string, Application>();
      dbApps.forEach(a => combinedMap.set(a.id, a));
      fallbackApps.forEach(a => {
        if (!combinedMap.has(a.id)) {
          combinedMap.set(a.id, a);
        }
      });
      localApps.forEach(a => {
        if (!combinedMap.has(a.id)) {
          combinedMap.set(a.id, a);
        }
      });

      const overrides = getReadOverrides();
      const result = Array.from(combinedMap.values())
        .map(a => (a.id in overrides ? { ...a, is_read: overrides[a.id] } : a))
        .sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      setApplications(result);
    } catch (err) {
      console.error("Error in useApplications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [forceRefresh]);

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      if (id.startsWith('msg_')) {
        await supabase
          .from('messages')
          .update({ is_read: isRead })
          .eq('id', id.replace(/^msg_/, ''));
      } else {
        await supabase
          .from('applications')
          .update({ is_read: isRead })
          .eq('id', id);
      }
    } catch (err) {
      console.warn("DB markAsRead warning:", err);
    }

    setReadOverride(id, isRead);

    try {
      const stored = localStorage.getItem(LOCAL_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);
        parsed = parsed.map((a: any) => a.id === id ? { ...a, is_read: isRead } : a);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
      }
    } catch (e) {}

    setApplications(prev => prev.map(a => a.id === id ? { ...a, is_read: isRead } : a));
    window.dispatchEvent(new CustomEvent('ngo_applications_updated'));
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      if (!id.startsWith('msg_')) {
        await supabase
          .from('applications')
          .update({ status })
          .eq('id', id);
      }
    } catch (err) {
      console.warn("DB updateStatus warning:", err);
    }

    try {
      const stored = localStorage.getItem(LOCAL_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);
        parsed = parsed.map((a: any) => a.id === id ? { ...a, status } : a);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
      }
    } catch (e) {}

    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const unreadCount = applications.filter(a => !a.is_read).length;

  return { applications, loading, refetch: fetchApplications, markAsRead, updateStatus, unreadCount };
}
