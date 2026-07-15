import { useEffect, useRef, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

declare global {
  interface Window {
    cloudinary: any;
  }
}

type ImageUploaderProps = {
  onUploadComplete: (url: string, publicId: string) => void;
  defaultImage?: string;
  className?: string;
};

export function ImageUploader({ onUploadComplete, defaultImage, className = '' }: ImageUploaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(defaultImage || null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Load Cloudinary script if not already loaded
    if (!document.getElementById('cloudinary-widget-script')) {
      const script = document.createElement('script');
      script.id = 'cloudinary-widget-script';
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          sources: ['local', 'url', 'camera'],
          multiple: false,
          maxFiles: 1,
          resourceType: 'image',
          clientAllowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
          styles: {
            palette: {
              window: '#ffffff',
              sourceBg: '#f4f4f5',
              windowBorder: '#e4e4e7',
              tabIcon: '#0F6E6E',
              inactiveTabIcon: '#a1a1aa',
              menuIcons: '#0F6E6E',
              link: '#0F6E6E',
              action: '#0F6E6E',
              inProgress: '#4CAF50',
              complete: '#4CAF50',
              error: '#ef4444',
              textDark: '#18181b',
              textLight: '#ffffff'
            }
          }
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            const url = result.info.secure_url;
            const publicId = result.info.public_id;
            setImageUrl(url);
            onUploadComplete(url, publicId);
          }
        }
      );
    }
  }, [isLoaded, onUploadComplete]);

  const openWidget = (e: React.MouseEvent) => {
    e.preventDefault();
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      console.warn("Cloudinary widget is not loaded yet.");
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageUrl(null);
    onUploadComplete('', '');
  };

  return (
    <div className={`w-full ${className}`}>
      {imageUrl ? (
        <div className="relative group rounded-xl overflow-hidden border border-black/10 shadow-sm aspect-video bg-black/5 flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt="Uploaded preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
            <button 
              onClick={openWidget}
              className="px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Replace Image
            </button>
            <button 
              onClick={handleRemove}
              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg hover:scale-110 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={openWidget}
          disabled={!isLoaded}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-zinc-300 hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-3 text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
            <UploadCloud size={24} className="text-zinc-400 group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm text-zinc-700 group-hover:text-primary transition-colors">
              Click to upload image
            </p>
            <p className="text-xs mt-1">JPEG, PNG, WebP up to 10MB</p>
          </div>
        </button>
      )}
    </div>
  );
}
