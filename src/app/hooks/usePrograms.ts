import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export type Program = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url: string;
  sort_order: number;
  points?: string[];
  created_at: string;
};

export function usePrograms(forceRefresh = false) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('sort_order', { ascending: true });
      
      const fallbackPrograms: Program[] = [
        { id: "p1", title: "Health & Eye Care", description: "Free eye check-up camps, spectacle distribution, and health awareness.", icon_name: "Heart", image_url: "https://archive.cehjournal.org/wp-content/uploads/2013/04/5591589853_b254109a50_o.jpg", sort_order: 1, created_at: new Date().toISOString() },
        { id: "p2", title: "Education & Skill", description: "Supporting youth with skill-building programs and awareness.", icon_name: "BookOpen", image_url: "https://srdsindia.org/wp-content/uploads/2021/09/teaching.jpeg", sort_order: 2, created_at: new Date().toISOString() },
        { id: "p3", title: "Women Empowerment", description: "Programs focused on confidence, self-sufficiency, and community.", icon_name: "Users", image_url: "https://images.deccanchronicle.com/dc-Cover-evutgf5c1ji9f3bioadrrd1q22-20170307231336.Medi.jpeg", sort_order: 3, created_at: new Date().toISOString() },
        { id: "p4", title: "Rural Development", description: "Drug-awareness programs, polio awareness drives, and rural outreach.", icon_name: "Globe", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrcFs-CJGepmn6IPdXItKuRt3EYDhm26uOQSb4Dnxt8awYzyYB_zzxtQyB&s=10", sort_order: 4, created_at: new Date().toISOString() }
      ];

      if (error) {
        console.error("Database connection failed, using fallback data.", error);
      }

      if (data && data.length > 0) {
        setPrograms(data);
      } else {
        setPrograms(fallbackPrograms);
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [forceRefresh]);

  return { programs, loading, refetch: fetchPrograms };
}
