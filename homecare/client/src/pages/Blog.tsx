import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Eye, Tag } from 'lucide-react';

const posts = [
  { id: 1, title: '10 Signs Your Elderly Parent Needs Professional Home Care', category: 'Elder Care', author: 'Dr. Priya Nair', readTime: '5 min', views: '12.3k', date: 'Jun 10, 2026', excerpt: 'Recognizing when a loved one needs more support at home can be challenging. Here are the key signs to watch for before seeking professional caregiving.', tags: ['Elder Care', 'Family Health'] },
  { id: 2, title: 'Complete Guide to Post-Surgery Recovery at Home', category: 'Recovery', author: 'Dr. Ramesh Kumar', readTime: '8 min', views: '8.7k', date: 'Jun 8, 2026', excerpt: 'Recovering after surgery at home requires careful planning, professional support, and the right environment. This comprehensive guide covers everything you need to know.', tags: ['Surgery', 'Recovery', 'Nursing'] },
  { id: 3, title: 'How AI is Transforming Home Healthcare in 2026', category: 'Technology', author: 'Rahul Verma', readTime: '6 min', views: '15.2k', date: 'Jun 5, 2026', excerpt: 'Artificial intelligence is revolutionizing the way we deliver and receive home healthcare. From smart caregiver matching to predictive health monitoring.', tags: ['AI', 'Technology', 'Future'] },
  { id: 4, title: 'Physiotherapy at Home vs Clinic: What is Better?', category: 'Physiotherapy', author: 'Ms. Anjali Singh', readTime: '4 min', views: '6.1k', date: 'Jun 3, 2026', excerpt: 'The debate between home physiotherapy and clinic sessions has a clear winner for most patients. Discover the research-backed benefits of home physiotherapy.', tags: ['Physiotherapy', 'Rehabilitation'] },
  { id: 5, title: 'Essential Postnatal Care Tips for New Mothers', category: 'Mother & Baby', author: 'Dr. Sunita Rao', readTime: '7 min', views: '9.4k', date: 'May 28, 2026', excerpt: "The first few weeks after delivery are crucial for both mother and baby. Our certified postnatal nurses share essential care tips backed by clinical experience.", tags: ['Postnatal', 'Newborn', 'Mother Care'] },
  { id: 6, title: 'Managing Chronic Pain at Home: A Nurse\'s Guide', category: 'Wellness', author: 'Ms. Divya Patel', readTime: '6 min', views: '5.8k', date: 'May 25, 2026', excerpt: 'Chronic pain management at home is possible with the right techniques, exercises, and professional guidance. Our experienced nurses break down evidence-based approaches.', tags: ['Pain Management', 'Wellness', 'Nursing'] },
];

const categories = ['All', 'Elder Care', 'Recovery', 'Technology', 'Physiotherapy', 'Mother & Baby', 'Wellness'];
const catColors: Record<string, string> = { 'Elder Care': 'bg-blue-100 text-blue-700', 'Recovery': 'bg-rose-100 text-rose-700', 'Technology': 'bg-purple-100 text-purple-700', 'Physiotherapy': 'bg-green-100 text-green-700', 'Mother & Baby': 'bg-pink-100 text-pink-700', 'Wellness': 'bg-teal-100 text-teal-700' };

export default function Blog() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = posts.filter(p =>
    (cat === 'All' || p.category === cat) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-20">
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title mb-4">
            Health <span className="gradient-text">Blog & Resources</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-subtitle mx-auto mb-8">
            Expert health tips, care guides, and insights from our certified healthcare professionals.
          </motion.p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input className="input-field pl-12 shadow-lg" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Categories */}
          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${cat === c ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <motion.article key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }} className="card-premium overflow-hidden group cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-primary-100 to-teal-100 flex items-center justify-center text-6xl">
                  {p.category === 'Elder Care' ? '👴' : p.category === 'Recovery' ? '🏥' : p.category === 'Technology' ? '🤖' : p.category === 'Physiotherapy' ? '🏃' : p.category === 'Mother & Baby' ? '👶' : '💊'}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`badge ${catColors[p.category] || 'bg-gray-100 text-gray-600'}`}>{p.category}</span>
                    <span className="text-xs text-gray-400">{p.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 font-display text-lg leading-tight mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{p.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4">
                    <span className="font-medium text-gray-600">{p.author}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.readTime}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{p.views}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500 font-medium">No articles found. Try a different search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
