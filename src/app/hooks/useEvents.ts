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
  is_free: boolean;
  price: number;
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
      
      const fallbackEvents: Event[] = [
        {
          id: "e1",
          title: "Mega Health Camp 2026",
          description: "A free mega health camp providing general health checkups, eye testing, and free medicines to the underprivileged.",
          image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
          event_date: "2026-08-15",
          location: "Community Hall, Alwal",
          status: "upcoming",
          show_register_button: true,
          is_free: true,
          price: 0,
          created_at: new Date().toISOString()
        },
        {
          id: "e2",
          title: "Women Empowerment Workshop",
          description: "Skill development workshop focusing on tailoring, basic computer skills, and financial literacy for rural women.",
          image_url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
          event_date: "2026-09-10",
          location: "ZPHS School, Tirumalagiri",
          status: "upcoming",
          show_register_button: true,
          is_free: false,
          price: 500,
          created_at: new Date().toISOString()
        }
      ];

      let data = null;
      try {
        data = await fetchPromise;
      } catch (e) {
        console.error("Database connection failed, using fallback data.");
      }

      if (data && data.length > 0) {
        cachedEvents = data;
        setEvents(data);
      } else {
        cachedEvents = fallbackEvents;
        setEvents(fallbackEvents);
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
