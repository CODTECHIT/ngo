import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { NEWS } from '../data';

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  img: string;
  tag: string;
  date: string;
  event_id?: string;
  created_at?: string;
};

const LOCAL_STORAGE_KEY = 'ngo_custom_news';
const DELETED_KEY = 'ngo_deleted_news';

function readDeleted(): Array<{ id?: string | null }> {
  try {
    return JSON.parse(localStorage.getItem(DELETED_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

// Only matches by exact ID so a newly created article can never be hidden by a
// previously deleted article that happens to share its title.
function isDeleted(item: NewsItem, deleted: Array<{ id?: string | null }>): boolean {
  if (!item.id) return false;
  return deleted.some(d => d && d.id != null && String(d.id) === String(item.id));
}

export function useNews(forceRefresh = false) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);

      // 1. Initial default fallback news items
      const defaultNewsItems: NewsItem[] = NEWS.map(n => ({
        id: String(n.id),
        title: n.title,
        excerpt: n.excerpt,
        content: n.excerpt,
        img: n.img,
        tag: n.tag,
        date: n.date,
        created_at: new Date().toISOString()
      }));

      // 2. Fetch local storage items
      let localNews: NewsItem[] = [];
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          localNews = JSON.parse(stored);
        }
      } catch (e) {
        console.warn("Failed to parse local news items:", e);
      }

      // 3. Fetch Supabase items
      let dbNews: NewsItem[] = [];
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          dbNews = data.map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt || '',
            content: item.content || item.excerpt || '',
            img: item.img || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=380&fit=crop&auto=format',
            tag: item.tag || 'Community',
            date: item.date || new Date(item.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            event_id: item.event_id,
            created_at: item.created_at
          }));
        }
      } catch (dbErr) {
        console.warn("Could not fetch news from database, using fallback and local storage:", dbErr);
      }

      // 4. Combine in priority order: DB > Local Storage > Default static news
      const combinedMap = new Map<string, NewsItem>();

      // Add DB news first
      dbNews.forEach(item => combinedMap.set(item.id, item));

      // Add local news if not already present by ID or exact title
      localNews.forEach(item => {
        const exists = Array.from(combinedMap.values()).some(existing => existing.id === item.id || existing.title.toLowerCase().trim() === item.title.toLowerCase().trim());
        if (!exists) {
          combinedMap.set(item.id, item);
        }
      });

      // Add default news if not already present
      defaultNewsItems.forEach(item => {
        const exists = Array.from(combinedMap.values()).some(existing => existing.id === item.id || existing.title.toLowerCase().trim() === item.title.toLowerCase().trim());
        if (!exists) {
          combinedMap.set(item.id, item);
        }
      });

      const result = Array.from(combinedMap.values()).filter(item => !isDeleted(item, readDeleted()));
      setNews(result);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    const handleUpdate = () => fetchNews();
    window.addEventListener('ngo_news_updated', handleUpdate);
    return () => window.removeEventListener('ngo_news_updated', handleUpdate);
  }, [forceRefresh]);

  return { news, loading, refetch: fetchNews };
}
