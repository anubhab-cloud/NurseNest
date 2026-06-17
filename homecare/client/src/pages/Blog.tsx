import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, ArrowRight, BookOpen, Users, RefreshCw, Sparkles,
  ChevronDown, ChevronUp, Shield, Download
} from 'lucide-react';
import { BLOG_POSTS, CATEGORIES, RESOURCES, BLOG_FAQS } from '../lib/blogData';
import BlogCard from '../components/blog/BlogCard';
import FeaturedArticle from '../components/blog/FeaturedArticle';
import CategoryFilter from '../components/blog/CategoryFilter';
import NewsletterSection from '../components/blog/NewsletterSection';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } } as const;
const stagger = { visible: { transition: { staggerChildren: 0.08 } } } as const;
const ease = [0.16, 1, 0.3, 1] as const;

// Floating stat badge component
function FloatBadge({ icon, label, value, delay, pos }: { icon: string; label: string; value: string; delay: number; pos: string }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay }}
      className={`absolute ${pos} hidden lg:flex items-center gap-3 bg-white rounded-2xl px-4 py-3`}
      style={{ border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-bold text-sm" style={{ color: '#0F172A' }}>{value}</p>
        <p className="text-xs" style={{ color: '#94A3B8' }}>{label}</p>
      </div>
    </motion.div>
  );
}

export default function Blog() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('all');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const featured = BLOG_POSTS.find(p => p.featured)!;

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter(p => {
      if (p.featured) return false;
      const matchCat = category === 'all' || CATEGORIES.find(c => c.id === category)?.label === p.category;
      const matchSearch = !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        p.author.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <div className="overflow-x-hidden" style={{ background: '#F8FAFC' }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-20 overflow-hidden" style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        {/* Gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle,#2563EB,transparent)', transform: 'translate(20%,-20%)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: 'radial-gradient(circle,#14B8A6,transparent)', transform: 'translate(-20%,20%)' }} />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} transition={{ ease }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                <BookOpen className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />
                <span className="text-xs font-semibold" style={{ color: '#2563EB' }}>Healthcare Knowledge Center</span>
              </motion.div>

              <motion.h1 variants={fadeUp} transition={{ ease }}
                className="font-bold mb-6"
                style={{ fontSize: 'clamp(40px,5vw,64px)', color: '#0F172A', letterSpacing: '-0.03em', lineHeight: '1.1' }}>
                Healthcare<br />
                <span style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Knowledge Center
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} transition={{ ease }}
                className="mb-8 leading-relaxed max-w-[500px]"
                style={{ fontSize: '17px', color: '#64748B', lineHeight: '1.8' }}>
                Expert-written guides, elder care insights, nursing resources, and physiotherapy advice
                to help families make <strong style={{ color: '#0F172A', fontWeight: 600 }}>informed healthcare decisions</strong>.
              </motion.p>

              <motion.div variants={fadeUp} transition={{ ease }} className="flex gap-3 mb-10">
                <a href="#articles" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                  style={{ background: '#2563EB', boxShadow: '0 2px 8px rgba(37,99,235,0.3)', minHeight: 'unset', minWidth: 'unset' }}>
                  Browse Articles <ArrowRight className="w-4 h-4" />
                </a>
                <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F172A', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minHeight: 'unset', minWidth: 'unset' }}>
                  Book Consultation
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div variants={fadeUp} transition={{ ease }} className="flex flex-wrap gap-6">
                {[
                  { icon: BookOpen, value: '48+',    label: 'Expert Articles'    },
                  { icon: Users,    value: '24,000+', label: 'Monthly Readers'   },
                  { icon: Shield,   value: '100%',    label: 'Clinician Reviewed' },
                  { icon: RefreshCw,value: 'Weekly',  label: 'New Content'        },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF' }}>
                      <s.icon className="w-4 h-4" style={{ color: '#2563EB' }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-none" style={{ color: '#0F172A' }}>{s.value}</p>
                      <p className="text-xs leading-none mt-0.5" style={{ color: '#94A3B8' }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — visual with floating cards */}
            <div className="relative h-[480px] hidden lg:block">
              {/* Main illustration card */}
              <motion.div
                animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-x-8 top-8 rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 24px 64px rgba(37,99,235,0.15)' }}>
                <div className="h-56 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  <span className="text-8xl">📚</span>
                </div>
                <div className="p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>Elder Care</span>
                    <span className="text-xs" style={{ color: '#94A3B8' }}>7 min read</span>
                  </div>
                  <p className="font-bold text-sm" style={{ color: '#0F172A' }}>10 Signs Your Elderly Parent Needs Professional Home Care</p>
                </div>
              </motion.div>

              <FloatBadge icon="📰" label="Latest Article" value="Published Today"  delay={0}   pos="top-4 left-0" />
              <FloatBadge icon="✅" label="Expert Verified" value="All Articles"    delay={0.8} pos="top-32 -right-4" />
              <FloatBadge icon="👥" label="Monthly Readers" value="10k+"           delay={1.6} pos="bottom-24 left-0" />
              <FloatBadge icon="🔄" label="Weekly Updates"  value="Every Wednesday" delay={2.4} pos="bottom-8 right-0" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ SEARCH BAR ════════════════════════════════════════════════════ */}
      <div className="py-8" style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
          <div className="relative max-w-[600px] mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94A3B8' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search articles, topics, conditions..."
              className="w-full pl-12 pr-4 h-12 rounded-xl outline-none transition-all"
              style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', fontSize: '15px', color: '#0F172A' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
              onBlur={e =>  { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium px-2 py-1 rounded-lg"
                style={{ color: '#64748B', background: '#F1F5F9', minHeight: 'unset', minWidth: 'unset' }}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">

        {/* ══ FEATURED ARTICLE ════════════════════════════════════════════ */}
        <section className="py-16">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-5 h-5" style={{ color: '#2563EB' }} />
            <h2 className="font-bold" style={{ fontSize: '22px', color: '#0F172A' }}>Editor's Pick</h2>
          </div>
          <FeaturedArticle post={featured} />
        </section>

        {/* ══ CATEGORIES ══════════════════════════════════════════════════ */}
        <section className="pb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold" style={{ fontSize: '18px', color: '#0F172A' }}>Browse by Category</h2>
          </div>
          <CategoryFilter active={category} onChange={setCategory} />
        </section>

        {/* ══ BLOG GRID ═══════════════════════════════════════════════════ */}
        <section id="articles" className="py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-bold" style={{ fontSize: '22px', color: '#0F172A' }}>
                {search ? `Results for "${search}"` : category === 'all' ? 'All Articles' : CATEGORIES.find(c => c.id === category)?.label}
              </h2>
              <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>{filtered.length} articles found</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div key={`${category}-${search}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-20 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <p className="text-5xl mb-4">🔍</p>
                <p className="font-semibold" style={{ color: '#0F172A' }}>No articles found</p>
                <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>Try a different search term or category</p>
                <button onClick={() => { setSearch(''); setCategory('all'); }}
                  className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: '#EFF6FF', color: '#2563EB', minHeight: 'unset', minWidth: 'unset' }}>
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ══ HEALTHCARE RESOURCES ════════════════════════════════════════ */}
        <section className="py-16" style={{ borderTop: '1px solid #E2E8F0' }}>
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#2563EB' }}>Free Downloads</span>
            <h2 className="font-bold mt-2" style={{ fontSize: 'clamp(24px,3vw,32px)', color: '#0F172A', letterSpacing: '-0.02em' }}>
              Healthcare Resource Library
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#64748B' }}>Clinical-grade guides and toolkits — free for patients and families.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RESOURCES.map((r, i) => (
              <motion.div key={r.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, ease }}
                className="group rounded-2xl overflow-hidden flex flex-col"
                style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                {/* Color header */}
                <div className="h-24 flex items-center justify-center flex-shrink-0" style={{ background: r.gradient }}>
                  <span className="text-5xl">{r.emoji}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#64748B' }}>{r.tag}</span>
                  <h4 className="font-bold mb-2 text-sm leading-snug" style={{ color: '#0F172A' }}>{r.title}</h4>
                  <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: '#94A3B8' }}>{r.desc}</p>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
                    <span className="text-xs" style={{ color: '#94A3B8' }}>{r.downloads} downloads</span>
                    <button className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                      style={{ color: '#2563EB', minHeight: 'unset', minWidth: 'unset' }}>
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* ══ NEWSLETTER ══════════════════════════════════════════════════════ */}
      <NewsletterSection />

      {/* ══ FAQ ═════════════════════════════════════════════════════════════ */}
      <section className="py-20" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[720px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#2563EB' }}>FAQ</span>
            <h2 className="font-bold mt-2" style={{ fontSize: 'clamp(24px,3vw,32px)', color: '#0F172A', letterSpacing: '-0.02em' }}>
              About Our Knowledge Center
            </h2>
          </div>
          <div className="space-y-3">
            {BLOG_FAQS.map((faq, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${activeFaq === i ? '#BFDBFE' : '#E2E8F0'}`, background: activeFaq === i ? '#FAFEFF' : '#FFFFFF' }}>
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  style={{ minHeight: 'unset', minWidth: 'unset' }}>
                  <span className="font-semibold text-sm pr-4" style={{ color: activeFaq === i ? '#1D4ED8' : '#0F172A' }}>{faq.q}</span>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: activeFaq === i ? '#DBEAFE' : '#F8FAFC' }}>
                    {activeFaq === i
                      ? <ChevronUp  className="w-4 h-4" style={{ color: '#2563EB' }} />
                      : <ChevronDown className="w-4 h-4" style={{ color: '#94A3B8' }} />}
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: '1.75' }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 lg:h-0" />
    </div>
  );
}
