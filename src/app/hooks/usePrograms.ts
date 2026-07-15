import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export type Program = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

// Simple in-memory cache to prevent multiple fetches across components
let cachedPrograms: Program[] | null = null;
let fetchPromise: Promise<Program[] | null> | null = null;

export function usePrograms(forceRefresh = false) {
  const [programs, setPrograms] = useState<Program[]>(cachedPrograms || []);
  const [loading, setLoading] = useState(!cachedPrograms);

  const fetchPrograms = async (ignoreCache = false) => {
    try {
      if (ignoreCache) {
        setLoading(true);
      } else if (cachedPrograms) {
        setLoading(false);
        return;
      }

      if (!fetchPromise || ignoreCache) {
        fetchPromise = supabase
          .from('programs')
          .select('*')
          .order('sort_order', { ascending: true })
          .then(({ data }) => data);
      }
      
      const data = await fetchPromise;
      if (data) {
        cachedPrograms = data;
        setPrograms(data);
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms(forceRefresh);
  }, [forceRefresh]);

  return { programs, loading, refetch: () => fetchPrograms(true) };
}
