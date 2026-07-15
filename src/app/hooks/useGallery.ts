import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export type GalleryImage = {
  id: string;
  image_url: string;
  image_public_id?: string;
  category: 'Health' | 'Eye Care' | 'Women Empowerment' | 'Community' | 'Awareness Programs' | 'Events' | string;
  caption?: string;
  sort_order: number;
  created_at: string;
};

let cachedGallery: GalleryImage[] | null = null;
let fetchPromise: Promise<GalleryImage[] | null> | null = null;

export function useGallery(forceRefresh = false) {
  const [images, setImages] = useState<GalleryImage[]>(cachedGallery || []);
  const [loading, setLoading] = useState(!cachedGallery);

  const fetchGallery = async (ignoreCache = false) => {
    try {
      if (ignoreCache) {
        setLoading(true);
      } else if (cachedGallery) {
        setLoading(false);
        return;
      }

      if (!fetchPromise || ignoreCache) {
        fetchPromise = supabase
          .from('gallery_images')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false })
          .then(({ data }) => data);
      }
      
      const data = await fetchPromise;
      if (data) {
        cachedGallery = data;
        setImages(data);
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(forceRefresh);
  }, [forceRefresh]);

  return { images, loading, refetch: () => fetchGallery(true) };
}
