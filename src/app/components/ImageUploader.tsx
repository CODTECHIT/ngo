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
  acceptVideo?: boolean;
  acceptMultiple?: boolean;
  acceptPDF?: boolean;
};

export function ImageUploader({ onUploadComplete, defaultImage, className = '', acceptVideo = false, acceptMultiple = false, acceptPDF = false }: ImageUploaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(defaultImage ? defaultImage.split(',').filter(Boolean) : []);
  const widgetRef = useRef<any>(null);
  const onUploadCompleteRef = useRef(onUploadComplete);

  useEffect(() => {
    onUploadCompleteRef.current = onUploadComplete;
  }, [onUploadComplete]);

  useEffect(() => {
    setImageUrls(defaultImage ? defaultImage.split(',').filter(Boolean) : []);
  }, [defaultImage]);

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
    if (isLoaded && window.cloudinary && !widgetRef.current) {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      
      if (!cloudName || !uploadPreset) {
        console.error("Cloudinary env variables are missing");
        return;
      }

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ['local', 'url', 'camera'],
          multiple: acceptMultiple,
          maxFiles: acceptMultiple ? 10 : 1,
          resourceType: acceptPDF ? 'raw' : acceptVideo ? 'auto' : 'image',
          clientAllowedFormats: acceptPDF ? ['pdf'] : acceptVideo ? ['jpeg', 'png', 'jpg', 'webp', 'mp4', 'webm'] : ['jpeg', 'png', 'jpg', 'webp'],
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
            setImageUrls(prev => {
              const newUrls = acceptMultiple ? [...prev, url] : [url];
              onUploadCompleteRef.current(newUrls.join(','), publicId);
              return newUrls;
            });
          }
        }
      );
    }
  }, [isLoaded, acceptVideo, acceptMultiple, acceptPDF]);

  const openWidget = (e: React.MouseEvent) => {
    e.preventDefault();
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      console.warn("Cloudinary widget is not loaded yet.");
    }
  };

  const handleRemove = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newUrls = [...imageUrls];
    newUrls.splice(index, 1);
    setImageUrls(newUrls);
    onUploadCompleteRef.current(newUrls.join(','), '');
  };

  return (
    <div className={`w-full ${className}`}>
      {imageUrls.length > 0 ? (
        <div className="space-y-4">
          <div className={`grid gap-4 ${acceptMultiple ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-black/10 shadow-sm aspect-video bg-black/5 flex items-center justify-center">
                {url.match(/\.pdf$/i) || acceptPDF ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-500">
                    <span className="font-bold text-lg mb-1">PDF</span>
                    <span className="text-xs">Document</span>
                  </div>
                ) : url.match(/\.(mp4|webm)$/i) || url.includes('/video/upload/') ? (
                  <video src={url} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                  {!acceptMultiple && (
                    <button onClick={openWidget} className="px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                      Replace
                    </button>
                  )}
                  <button onClick={handleRemove(idx)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg hover:scale-110 transition-all">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {acceptMultiple && (
             <button onClick={openWidget} className="w-full py-3 rounded-xl border-2 border-dashed border-zinc-300 hover:border-primary/50 text-zinc-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-black/5 transition-colors">
               <UploadCloud size={18} /> Add More Images
             </button>
          )}
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
              Click to upload {acceptPDF ? 'PDF' : acceptVideo ? 'media' : 'image'}
            </p>
            <p className="text-xs mt-1">{acceptPDF ? 'PDF up to 10MB' : acceptVideo ? 'JPEG, PNG, MP4 up to 50MB' : 'JPEG, PNG, WebP up to 10MB'}</p>
          </div>
        </button>
      )}
    </div>
  );
}
