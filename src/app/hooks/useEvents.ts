import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export type Event = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  event_date: string;
  location: string;
  status: 'upcoming' | 'completed';
  show_register_button: boolean;
  created_at: string;
};

// Simple in-memory cache
let cachedEvents: Event[] | null = null;
let fetchPromise: Promise<Event[] | null> | null = null;

export function useEvents(forceRefresh = false) {
  const [events, setEvents] = useState<Event[]>(cachedEvents || []);
  const [loading, setLoading] = useState(!cachedEvents);

  const fetchEvents = async (ignoreCache = false) => {
    try {
      if (ignoreCache) {
        setLoading(true);
      } else if (cachedEvents) {
        setLoading(false);
        return;
      }

      if (!fetchPromise || ignoreCache) {
        fetchPromise = supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: false })
          .then(({ data }) => data);
      }
      
      const data = await fetchPromise;
      if (data) {
        cachedEvents = data;
        setEvents(data);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(forceRefresh);
  }, [forceRefresh]);

  return { events, loading, refetch: () => fetchEvents(true) };
}
