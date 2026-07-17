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
      
      const fallbackGallery: GalleryImage[] = [
        { id: "g1", image_url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80", category: "Health", caption: "Community Health Camp 2025", sort_order: 1, created_at: new Date().toISOString() },
        { id: "g2", image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80", category: "Education", caption: "School Supplies Distribution", sort_order: 2, created_at: new Date().toISOString() },
        { id: "g3", image_url: "https://images.unsplash.com/photo-1593113514676-568eb94ebdf8?w=800&q=80", category: "Community", caption: "Rural Development Program", sort_order: 3, created_at: new Date().toISOString() },
        { id: "g4", image_url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80", category: "Women Empowerment", caption: "Skill Training Workshop", sort_order: 4, created_at: new Date().toISOString() },
        { id: "g5", image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80", category: "Health", caption: "Blood Donation Drive", sort_order: 5, created_at: new Date().toISOString() }
      ];

      let data = null;
      try {
        data = await fetchPromise;
      } catch (e) {
        console.error("Database connection failed, using fallback data.");
      }

      if (data && data.length > 0) {
        cachedGallery = data;
        setImages(data);
      } else {
        cachedGallery = fallbackGallery;
        setImages(fallbackGallery);
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
