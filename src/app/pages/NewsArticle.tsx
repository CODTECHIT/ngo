import { useParams, Link } from 'react-router';
import { ArrowLeft, ArrowRight, Calendar, Tag, Loader2, Newspaper } from 'lucide-react';
import { motion } from 'motion/react';
import { useNews } from '../hooks/useNews';
import { ArticleContent } from '../components/ArticleContent';

export default function NewsArticle() {
  const { id } = useParams<{ id: string }>();
  const { news, loading } = useNews();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const article = news.find(n => String(n.id) === decodeURIComponent(id || ''));
  const others = news.filter(n => n.id !== article?.id).slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <p className="text-8xl font-bold text-primary/20 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>404</p>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Article Not Found</h1>
        <p className="text-muted-foreground mb-6">This news article doesn't exist or has been removed.</p>
        <Link to="/news" className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* ── Editorial Article Header ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F6F3EC] border-b-2 border-zinc-900">
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent-2 to-primary" />
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-12 md:pt-10 md:pb-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={15} /> Back to Newsroom
            </Link>

            <div className="flex items-center gap-3 mb-5 text-xs text-zinc-500 font-medium">
              <span className="text-[10px] font-bold px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md uppercase tracking-widest">
                {article.tag}
              </span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
              {article.event_id && (
                <span className="flex items-center gap-1.5"><Tag size={14} /> Linked to event</span>
              )}
            </div>

            <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 leading-[1.1] tracking-tight">
              {article.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── Article Body ─────────────────────────────────────────────────────── */}
      <section className="py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-6">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden"
          >
            {article.img && (
              <div className="w-full h-64 md:h-96 overflow-hidden bg-black/5">
                <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-6 md:p-12 lg:p-14">
              <ArticleContent html={article.content || article.excerpt} />
            </div>
          </motion.article>

          {article.event_id && (
            <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-zinc-900">Interested in attending?</h4>
                <p className="text-xs text-zinc-600">This news update is linked to an active organizational event.</p>
              </div>
              <Link to="/events" className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors shrink-0">
                View Events
              </Link>
            </div>
          )}

          {/* Related stories */}
          {others.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-3 mb-8">
                <span className="h-[2px] w-8 bg-gradient-to-r from-primary to-accent" />
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 font-['Playfair_Display'] tracking-tight">More from the Newsroom</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {others.map(other => (
                  <Link
                    key={other.id}
                    to={`/news/${encodeURIComponent(String(other.id))}`}
                    className="group bg-white rounded-2xl border border-black/5 shadow-lg overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all"
                  >
                    <div className="h-36 overflow-hidden bg-black/5">
                      <img src={other.img} alt={other.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded uppercase tracking-widest">{other.tag}</span>
                        <span className="text-[11px] text-zinc-500">{other.date}</span>
                      </div>
                      <h3 className="font-bold text-sm leading-snug text-zinc-900 line-clamp-2 group-hover:text-primary transition-colors">{other.title}</h3>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary mt-3 group-hover:translate-x-1 transition-transform">
                        Read story <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link to="/news" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
              <Newspaper size={16} /> View all news
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
