import { useState } from 'react';
import { supabaseAdmin as supabase } from '../../../lib/supabase';
import { usePrograms, Program } from '../../hooks/usePrograms';
import { ImageUploader } from '../../components/ImageUploader';
import { NavLink } from 'react-router';
import { 
  LayoutDashboard, FileText, List, Calendar, Image as ImageIcon, MessageSquare,
  Plus, Edit2, Trash2, Loader2, X, Heart, BookOpen, Users, Globe
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = { 
  heart: Heart, 
  book: BookOpen, 
  users: Users, 
  globe: Globe 
};

export default function AdminPrograms() {
  const { programs, loading, refetch } = usePrograms(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('heart');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [points, setPoints] = useState<string[]>([]);

  const addPoint = () => setPoints([...points, '']);
  const updatePoint = (index: number, value: string) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };
  const removePoint = (index: number) => {
    const newPoints = [...points];
    newPoints.splice(index, 1);
    setPoints(newPoints);
  };

  const openAddModal = () => {
    setEditingProgram(null);
    setTitle('');
    setDescription('');
    setIconName('heart');
    setImageUrl('');
    setSortOrder(programs.length); // Default to end of list
    setPoints([]);
    setIsModalOpen(true);
  };

  const openEditModal = (prog: Program) => {
    setEditingProgram(prog);
    setTitle(prog.title);
    setDescription(prog.description);
    setIconName(prog.icon_name);
    setImageUrl(prog.image_url);
    setSortOrder(prog.sort_order);
    setPoints(prog.points || []);
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
        title,
        description,
        icon_name: iconName,
        image_url: imageUrl,
        sort_order: sortOrder,
        points: points.filter(p => p.trim() !== '')
      };

      if (editingProgram) {
        const { error } = await supabase.from('programs').update(payload).eq('id', editingProgram.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('programs').insert([payload]);
        if (error) throw error;
      }
      
      await refetch();
      closeModal();
    } catch (err) {
      console.error("Error saving program:", err);
      alert("Failed to save program.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      const { error } = await supabase.from('programs').delete().eq('id', id);
      if (error) throw error;
      await refetch();
    } catch (err) {
      console.error("Error deleting program:", err);
      alert("Failed to delete program.");
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
        <nav className="flex-1 p-4 space-y-1">
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
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">Programs & Services</h1>
              <p className="text-zinc-500">Manage the core programs and services displayed on the website.</p>
            </div>
            <button onClick={openAddModal} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-colors">
              <Plus size={20} /> Add New Program
            </button>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {programs.map(prog => {
                const Icon = ICON_MAP[prog.icon_name] || Heart;
                return (
                  <div key={prog.id} className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden flex flex-col hover:border-primary/30 transition-colors">
                    <div className="relative h-48 bg-black/5 shrink-0 overflow-hidden">
                      {prog.image_url ? (
                        <img src={(prog.image_url || '').split(',')[0]} alt={prog.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
                      )}
                      <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
                        <Icon size={18} className="text-primary" />
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-xl text-zinc-900 mb-2">{prog.title}</h3>
                      <p className="text-zinc-600 text-sm mb-6 flex-1 line-clamp-3">{prog.description}</p>
                      
                      <div className="flex gap-2 mt-auto pt-4 border-t">
                        <button onClick={() => openEditModal(prog)} className="flex-1 flex justify-center items-center gap-2 py-2 bg-black/5 hover:bg-black/10 rounded-lg text-sm font-bold text-zinc-700 transition-colors">
                          <Edit2 size={16} /> Edit
                        </button>
                        <button onClick={() => handleDelete(prog.id)} className="flex-1 flex justify-center items-center gap-2 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold text-red-600 transition-colors">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {programs.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-black/10">
                  <p className="text-zinc-500 mb-4">No programs found.</p>
                  <button onClick={openAddModal} className="text-primary font-bold hover:underline">Create your first program</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-6 border-b flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-zinc-900 font-['Playfair_Display']">
                {editingProgram ? 'Edit Program' : 'Add New Program'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-black/5 rounded-full text-zinc-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Program Image</label>
                  <ImageUploader 
                    defaultImage={imageUrl} 
                    onUploadComplete={(url) => setImageUrl(url)} 
                    acceptMultiple={true}
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none resize-none" />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Icon</label>
                      <select value={iconName} onChange={e => setIconName(e.target.value)} required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none appearance-none bg-white">
                        <option value="heart">Heart</option>
                        <option value="book">Book (Education)</option>
                        <option value="users">Users (Empowerment)</option>
                        <option value="globe">Globe (Community)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold text-zinc-700">Key Points / Features</label>
                      <button type="button" onClick={addPoint} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                        <Plus size={14} /> Add Point
                      </button>
                    </div>
                    {points.length === 0 ? (
                      <div className="text-sm text-zinc-500 italic bg-black/5 p-4 rounded-xl text-center">No points added.</div>
                    ) : (
                      <div className="space-y-2">
                        {points.map((point, index) => (
                          <div key={index} className="flex gap-2">
                            <input 
                              type="text" 
                              value={point} 
                              onChange={e => updatePoint(index, e.target.value)} 
                              placeholder={`Point ${index + 1}`}
                              className="w-full px-4 py-2 text-sm rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none"
                            />
                            <button type="button" onClick={() => removePoint(index)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold text-zinc-600 hover:bg-black/5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving || !imageUrl} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50">
                  {saving && <Loader2 className="animate-spin" size={20} />}
                  Save Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
