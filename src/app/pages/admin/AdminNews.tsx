import { useState } from 'react';
import { supabaseAdmin as supabase } from '../../../lib/supabase';
import { useNews, type NewsItem } from '../../hooks/useNews';
import { ImageUploader } from '../../components/ImageUploader';
import { AdminSidebar } from '../../components/AdminSidebar';
import { Plus, Edit2, Trash2, Loader2, X, Image as ImageIcon, Newspaper } from 'lucide-react';

const TAG_OPTIONS = ["Campaign", "Recognition", "Partnership", "Impact", "Community", "Environment", "Announcement"];
const LOCAL_STORAGE_KEY = 'ngo_custom_news';

export default function AdminNews() {
  const { news, loading, refetch } = useNews(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Campaign');
  const [date, setDate] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [img, setImg] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setTag('Campaign');
    setDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    setExcerpt('');
    setContent('');
    setImg('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setTag(item.tag || 'Campaign');
    setDate(item.date || '');
    setExcerpt(item.excerpt || '');
    setContent(item.content || item.excerpt || '');
    setImg(item.img || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      tag,
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      excerpt,
      content: content || excerpt,
      img: img || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=380&fit=crop&auto=format'
    };

    let dbSuccess = false;

    // 1. Try updating database
    try {
      if (editingItem) {
        const { error } = await supabase.from('news').update(payload).eq('id', editingItem.id);
        if (!error) dbSuccess = true;
      } else {
        const { error } = await supabase.from('news').insert([payload]);
        if (!error) dbSuccess = true;
      }
    } catch (dbErr) {
      console.warn("DB save failed, falling back to LocalStorage:", dbErr);
    }

    // 2. Always update local storage backup as well to guarantee immediate visibility
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      let localItems: NewsItem[] = stored ? JSON.parse(stored) : [];

      if (editingItem) {
        localItems = localItems.map(i => i.id === editingItem.id ? { ...i, ...payload } : i);
      } else {
        const newItem: NewsItem = {
          id: 'local_news_' + Date.now(),
          ...payload,
          created_at: new Date().toISOString()
        };
        localItems.unshift(newItem);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localItems));
    } catch (e) {
      console.error("Error saving local news fallback:", e);
    }

    window.dispatchEvent(new Event('ngo_news_updated'));
    await refetch();
    setSaving(false);
    closeModal();
  };

  const handleDelete = async (item: NewsItem) => {
    if (!window.confirm(`Are you sure you want to delete article "${item.title}"?`)) return;

    try {
      // 1. Delete from DB
      await supabase.from('news').delete().eq('id', item.id);
    } catch (e) {
      console.warn("DB delete error:", e);
    }

    // 2. Delete from LocalStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        let localItems: NewsItem[] = JSON.parse(stored);
        localItems = localItems.filter(i => i.id !== item.id && i.title.toLowerCase().trim() !== item.title.toLowerCase().trim());
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localItems));
      }
    } catch (e) {}

    window.dispatchEvent(new Event('ngo_news_updated'));
    await refetch();
  };

  return (
    <div className="min-h-screen bg-black/5 flex flex-col md:flex-row font-['Lato']">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                <Newspaper size={18} />
                <span>Media & Content</span>
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">News & Articles</h1>
              <p className="text-zinc-500">Manage press releases, campaign highlights, and news stories.</p>
            </div>
            <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-colors shrink-0">
              <Plus size={20} /> Add New Article
            </button>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/5 border-b border-black/5">
                      <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Article</th>
                      <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Category Tag</th>
                      <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Published Date</th>
                      <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-zinc-500">No articles found. Add one to publish news to users.</td>
                      </tr>
                    ) : (
                      news.map((item) => (
                        <tr key={item.id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-12 rounded-lg bg-black/5 overflow-hidden shrink-0 border border-black/10">
                                {item.img ? (
                                  <img src={item.img} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-zinc-400"><ImageIcon size={16} /></div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-zinc-900 line-clamp-1">{item.title}</p>
                                <p className="text-xs text-zinc-500 line-clamp-1 mt-1">{item.excerpt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs font-bold uppercase tracking-wider">
                              {item.tag}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-zinc-600 font-medium">
                            {item.date}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEditModal(item)} className="p-2 text-zinc-600 hover:bg-black/5 rounded-lg transition-colors" title="Edit">
                                <Edit2 size={18} />
                              </button>
                              <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
                {editingItem ? 'Edit News Article' : 'Add New Article'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-black/5 rounded-full text-zinc-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Featured Image</label>
                  <ImageUploader
                    defaultImage={img}
                    onUploadComplete={(url) => setImg(url)}
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Article Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                      placeholder="e.g., Annual Health Camp Drives Clean Water Awareness"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Category Tag</label>
                      <select value={tag} onChange={e => setTag(e.target.value)} required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none bg-white">
                        {TAG_OPTIONS.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Publication Date</label>
                      <input type="text" value={date} onChange={e => setDate(e.target.value)}
                        placeholder="e.g., July 29, 2026"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Short Excerpt</label>
                    <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} required
                      placeholder="A brief 1-2 sentence summary for preview cards..."
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Full Article Body</label>
                    <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} required
                      placeholder="Write full article details here..."
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-primary outline-none resize-y" />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold text-zinc-600 hover:bg-black/5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving || !title} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50">
                  {saving && <Loader2 className="animate-spin" size={20} />}
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
