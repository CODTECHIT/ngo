import { useState } from 'react';
import { supabaseAdmin as supabase } from '../../../lib/supabase';
import { useGallery, GalleryImage } from '../../hooks/useGallery';
import { ImageUploader } from '../../components/ImageUploader';
import { NavLink } from 'react-router';
import { 
  LayoutDashboard, FileText, List, Calendar, Image as ImageIcon, MessageSquare,
  Plus, Edit2, Trash2, Loader2, X, Video
} from 'lucide-react';

export default function AdminGallery() {
  const { images, loading, refetch } = useGallery(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Events');
  const [caption, setCaption] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(0);

  const openAddModal = () => {
    setEditingImage(null);
    setImageUrl('');
    setCategory('Events');
    setCaption('');
    setSortOrder(images.length);
    setIsModalOpen(true);
  };

  const openEditModal = (img: GalleryImage) => {
    setEditingImage(img);
    setImageUrl(img.image_url);
    setCategory(img.category);
    setCaption(img.caption || '');
    setSortOrder(img.sort_order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        image_url: imageUrl,
        category,
        caption,
        sort_order: sortOrder
      };

      if (editingImage) {
        const { error } = await supabase.from('gallery_images').update(payload).eq('id', editingImage.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('gallery_images').insert([payload]);
        if (error) throw error;
      }
      
      await refetch();
      closeModal();
    } catch (err) {
      console.error("Error saving gallery image:", err);
      alert("Failed to save media.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;
    try {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
      await refetch();
    } catch (err) {
      console.error("Error deleting gallery image:", err);
      alert("Failed to delete media.");
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin/ngo/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Programs / Services', path: '/admin/ngo/programs', icon: <List size={18} /> },
    { name: 'Events', path: '/admin/ngo/events', icon: <Calendar size={18} /> },
    { name: 'Gallery', path: '/admin/ngo/gallery', icon: <ImageIcon size={18} /> },
    { name: 'Contact Messages', path: '/admin/ngo/contact-messages', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-black/5 flex flex-col md:flex-row font-['Lato']">
      <aside className="w-full md:w-64 bg-white border-r border-black/5 shrink-0 flex flex-col">
        <div className="p-6 border-b border-black/5 flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center">
            <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-sm tracking-tight text-zinc-900">ADMIN PORTAL</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-zinc-600 hover:bg-black/5 hover:text-zinc-900'}`
            }>
              {link.icon} {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">Gallery</h1>
              <p className="text-zinc-500">Manage photos and videos for the gallery and home page.</p>
            </div>
            <button onClick={openAddModal} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-colors">
              <Plus size={20} /> Add Media
            </button>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map(img => {
                const isVideo = img.image_url?.match(/\.(mp4|webm)$/i) || img.image_url?.includes('/video/upload/');
                return (
                  <div key={img.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 flex flex-col group relative">
                    <div className="h-48 bg-black/5 relative overflow-hidden shrink-0">
                      {isVideo ? (
                        <video src={img.image_url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={img.image_url} alt={img.caption || 'Gallery Image'} className="w-full h-full object-cover" />
                      )}
                      {isVideo && (
                        <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-md">
                          <Video size={16} />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-zinc-800 text-xs font-bold px-2 py-1 rounded shadow-sm">
                        {img.category}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-zinc-600 text-sm mb-4 flex-1 line-clamp-2">{img.caption || 'No caption'}</p>
                      
                      <div className="flex gap-2 mt-auto">
                        <button onClick={() => openEditModal(img)} className="flex-1 flex justify-center items-center gap-2 py-2 bg-black/5 hover:bg-black/10 rounded-lg text-sm font-bold text-zinc-700 transition-colors">
                          <Edit2 size={16} /> Edit
                        </button>
                        <button onClick={() => handleDelete(img.id)} className="flex-1 flex justify-center items-center gap-2 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold text-red-600 transition-colors">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {images.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-black/10">
                  <p className="text-zinc-500 mb-4">No media found.</p>
                  <button onClick={openAddModal} className="text-primary font-bold hover:underline">Upload your first photo/video</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-6 border-b flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-zinc-900 font-['Playfair_Display']">
                {editingImage ? 'Edit Media' : 'Add New Media'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-black/5 rounded-full text-zinc-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Media File (Photo/Video)</label>
                <ImageUploader 
                  defaultImage={imageUrl} 
                  onUploadComplete={(url) => setImageUrl(url)} 
                  acceptVideo={true}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none appearance-none bg-white">
                    <option value="Health">Health</option>
                    <option value="Eye Care">Eye Care</option>
                    <option value="Women Empowerment">Women Empowerment</option>
                    <option value="Community">Community</option>
                    <option value="Awareness Programs">Awareness Programs</option>
                    <option value="Events">Events</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Sort Order</label>
                  <input type="number" value={sortOrder} onChange={e => setSortOrder(parseInt(e.target.value) || 0)} required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1">Caption (Optional)</label>
                <input type="text" value={caption} onChange={e => setCaption(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold text-zinc-600 hover:bg-black/5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving || !imageUrl} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50">
                  {saving && <Loader2 className="animate-spin" size={20} />}
                  Save Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
