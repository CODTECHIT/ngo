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
  certificate_template_url?: string;
};

export function useEvents(forceRefresh = false) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
      
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

      if (error) {
        console.error("Database connection failed, using fallback data.", error);
      }

      let processedData = fallbackEvents;

      if (data && data.length > 0) {
        processedData = data;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of day

      // Dynamically compute status based on date
      const finalData = processedData.map(ev => {
        const evDate = new Date(ev.event_date);
        const isPast = evDate < today;
        return {
          ...ev,
          status: isPast ? 'completed' : ev.status
        };
      });

      setEvents(finalData as Event[]);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [forceRefresh]);

  return { events, loading, refetch: fetchEvents };
}
