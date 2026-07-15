import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export type SiteContent = {
  id: number;
  hero_heading: string;
  hero_subheading: string;
  stats: { number: string; label: string }[];
  about_text: string;
  mission_text: string;
  vision_text: string;
  director_name: string;
  director_quote: string;
  director_photo_url: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
};

// Singleton cache to prevent multiple requests across components on initial load
let cachedContent: SiteContent | null = null;
let fetchPromise: Promise<SiteContent | null> | null = null;

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(cachedContent);
  const [loading, setLoading] = useState(!cachedContent);

  useEffect(() => {
    if (cachedContent) {
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        if (!fetchPromise) {
          fetchPromise = supabase
            .from('site_content')
            .select('*')
            .eq('id', 1)
            .single()
            .then(({ data }) => data);
        }

        const data = await fetchPromise;
        if (data) {
          cachedContent = data;
          setContent(data);
        }
      } catch (err) {
        console.error("Error fetching site content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Provide safe defaults so UI doesn't crash or look totally empty before user fills it
  const safeContent = content || {
    id: 1,
    hero_heading: "Empowering Communities for a Brighter Tomorrow",
    hero_subheading: "Join Srishreevision Foundation in creating lasting impact through healthcare, education, and women empowerment.",
    stats: [
      { number: "50,000+", label: "Lives Impacted" },
      { number: "100+", label: "Health Camps" },
      { number: "25+", label: "Villages Reached" },
      { number: "1,000+", label: "Women Empowered" }
    ],
    about_text: "We are a registered non-profit foundation dedicated to uplifting the most vulnerable segments of society...",
    mission_text: "To provide accessible healthcare, quality education, and sustainable livelihood opportunities...",
    vision_text: "A world where every individual has the opportunity to thrive and live with dignity...",
    director_name: "",
    director_quote: "True progress is measured by how we uplift the most vulnerable among us.",
    director_photo_url: "",
    contact_phone: "+91 98765 43210",
    contact_email: "contact@srishreevision.org",
    contact_address: "123 Main Street, Hyderabad, Telangana, India"
  };

  return { content: safeContent, loading, originalData: content };
}
