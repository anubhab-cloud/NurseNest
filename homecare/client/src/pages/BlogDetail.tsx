import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Clock, Eye, Calendar, RefreshCw, Bookmark, Printer,
  Linkedin, Twitter, Facebook, Link2, CheckCircle, ArrowLeft, ArrowRight,
  User, BookOpen, Share2
} from 'lucide-react';
import { BLOG_POSTS } from '../lib/blogData';
import ReadingProgress from '../components/blog/ReadingProgress';
import TableOfContents from '../components/blog/TableOfContents';
import ArticleContent from '../components/blog/ArticleContent';
import BlogCard from '../components/blog/BlogCard';
import NewsletterSection from '../components/blog/NewsletterSection';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied]         = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#F8FAFC' }}>
      <p className="text-6xl mb-4">📭</p>
      <h2 className="font-bold text-xl mb-2" style={{ color: '#0F172A' }}>Article Not Found</h2>
      <p className="text-sm mb-6" style={{ color: '#64748B' }}>This article may have been moved or deleted.</p>
      <Link to="/blog" className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
        style={{ background: '#2563EB', minHeight: 'unset', minWidth: 'unset' }}>
        Back to Blog
      </Link>
    </div>
  );

  const related = BLOG_POSTS.filter(p => p.id !== post.id && (p.category === post.category || p.featured)).slice(0, 3);

  const SHARE_LINKS = [
    { icon: Linkedin, label: 'LinkedIn', color: '#0A66C2', href: `https://linkedin.com/shareArticle?url=${encodeURIComponent(window.location.href)}` },
    { icon: Twitter,  label: 'Twitter',  color: '#1DA1F2', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}` },
    { icon: Facebook, label: 'Facebook', color: '#1877F2', href: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
  ];

  return (
    <div style={{ background: '#F8FAFC' }}>
      <ReadingProgress />

      {/* ══ ARTICLE HEADER ═════════════════════════════════════════════════ */}
      <header className="pt-16" style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16 pt-10 pb-0">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: '#94A3B8' }}>
            {[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.category, href: '/blog' }, { label: post.title.slice(0, 30) + '…' }].map((crumb, i, arr) => (
              <span key={i} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-blue-600 transition-colors font-medium"
                    style={{ minHeight: 'unset', minWidth: 'unset', color: '#64748B' }}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium" style={{ color: '#0F172A' }}>{crumb.label}</span>
                )}
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
              </span>
            ))}
          </nav>

          {/* Category + verification */}
          <div className="flex items-center gap-3 mb-5">
            <span className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
              {post.category}
            </span>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" style={{ color: '#14B8A6' }} />
              <span className="text-xs font-medium" style={{ color: '#14B8A6' }}>Clinician Reviewed</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-bold mb-4 max-w-[800px]" style={{ fontSize: 'clamp(28px,4vw,48px)', color: '#0F172A', letterSpacing: '-0.03em', lineHeight: '1.15' }}>
            {post.title}
          </h1>
          <p className="mb-8 max-w-[680px]" style={{ fontSize: '18px', color: '#64748B', lineHeight: '1.75' }}>
            {post.subtitle}
          </p>

          {/* Author + meta row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
                {post.author.avatar}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#0F172A' }}>{post.author.name}</p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>{post.author.role} · {post.author.exp} experience</p>
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-4 text-xs" style={{ color: '#94A3B8' }}>
              {[
                { icon: Calendar,   val: post.publishDate },
                { icon: RefreshCw,  val: `Updated ${post.updatedDate}` },
                { icon: Clock,      val: `${post.readTime} min read` },
                { icon: Eye,        val: `${(post.views / 1000).toFixed(1)}k views` },
              ].map(m => (
                <div key={m.val} className="flex items-center gap-1.5">
                  <m.icon className="w-3.5 h-3.5" />
                  <span className="font-medium">{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
          <div className="relative h-[280px] sm:h-[360px] lg:h-[440px] rounded-t-2xl overflow-hidden flex items-center justify-center"
            style={{ background: post.coverGradient }}>
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }} />
            <span className="text-[120px] sm:text-[160px] select-none relative z-10 opacity-70">{post.coverEmoji}</span>
          </div>
        </div>
      </header>

      {/* ══ ARTICLE BODY ═══════════════════════════════════════════════════ */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-12">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12 items-start">

          {/* Content column */}
          <div ref={articleRef}>
            {/* Article content */}
            <div className="rounded-2xl p-6 sm:p-8 lg:p-10 mb-8"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>

              {/* Action bar */}
              <div className="flex items-center justify-between mb-8 pb-6" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} minute read</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setBookmarked(!bookmarked)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: bookmarked ? '#EFF6FF' : '#F8FAFC', color: bookmarked ? '#2563EB' : '#64748B', border: '1px solid #E2E8F0', minHeight: 'unset', minWidth: 'unset' }}>
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                    {bookmarked ? 'Saved' : 'Save'}
                  </button>
                  <button onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0', minHeight: 'unset', minWidth: 'unset' }}>
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                  <button onClick={() => setShareVisible(!shareVisible)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE', minHeight: 'unset', minWidth: 'unset' }}>
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>

              {/* Share panel */}
              <AnimatePresence>
                {shareVisible && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6">
                    <div className="flex flex-wrap gap-2 p-4 rounded-xl mb-2" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      {SHARE_LINKS.map(s => (
                        <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90"
                          style={{ background: s.color, minHeight: 'unset', minWidth: 'unset' }}>
                          <s.icon className="w-3.5 h-3.5" /> {s.label}
                        </a>
                      ))}
                      <button onClick={copyLink}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: copied ? '#D1FAE5' : '#F1F5F9', color: copied ? '#065F46' : '#64748B', minHeight: 'unset', minWidth: 'unset' }}>
                        {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Link2 className="w-3.5 h-3.5" /> Copy Link</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main markdown content */}
              <ArticleContent content={post.content} />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: '1px solid #F1F5F9' }}>
                <span className="text-xs font-semibold mr-2" style={{ color: '#64748B' }}>Tags:</span>
                {post.tags.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Author card */}
            <div className="rounded-2xl p-6 sm:p-8 mb-8"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
                  {post.author.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold" style={{ color: '#0F172A' }}>{post.author.name}</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                      Verified Author
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: '#64748B' }}>{post.author.role} · {post.author.exp} experience</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{post.author.bio}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: '#94A3B8' }}>
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{post.author.articles} articles</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold mb-6" style={{ fontSize: '20px', color: '#0F172A' }}>Related Articles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {related.map((p, i) => <BlogCard key={p.id} post={p} index={i} />)}
                </div>
              </div>
            )}

            {/* Prev/Next nav */}
            <div className="flex gap-4">
              <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F172A', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', minHeight: 'unset', minWidth: 'unset' }}>
                <ArrowLeft className="w-4 h-4" /> Back to Blog
              </button>
              <Link to="/booking"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all text-white"
                style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)', boxShadow: '0 2px 8px rgba(37,99,235,0.25)', minHeight: 'unset', minWidth: 'unset' }}>
                Book a Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Sticky sidebar */}
          <aside className="hidden lg:block">
            <TableOfContents content={post.content} />
          </aside>
        </div>
      </div>

      <NewsletterSection />
      <div className="h-20 lg:h-0" />
    </div>
  );
}
