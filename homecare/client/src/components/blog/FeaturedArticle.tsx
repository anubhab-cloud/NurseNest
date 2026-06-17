import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Eye, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import type { BlogPost } from '../../lib/blogData';

export default function FeaturedArticle({ post }: { post: BlogPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="grid lg:grid-cols-2 rounded-2xl overflow-hidden"
      style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
    >
      {/* Left — visual */}
      <div className="relative h-64 lg:h-auto min-h-[320px] overflow-hidden flex items-center justify-center group"
        style={{ background: post.coverGradient }}>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        <motion.span
          animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[120px] select-none z-10 relative">
          {post.coverEmoji}
        </motion.span>
        {/* Featured badge */}
        <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
          <BookOpen className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs font-bold tracking-wide uppercase">Featured Article</span>
        </div>
        {/* Stats */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
          {[
            { icon: Clock, value: `${post.readTime} min read` },
            { icon: Eye, value: `${(post.views / 1000).toFixed(1)}k views` },
          ].map(s => (
            <div key={s.value} className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <s.icon className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-medium">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — content */}
      <div className="p-8 lg:p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
              {post.category}
            </span>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" style={{ color: '#14B8A6' }} />
              <span className="text-xs font-medium" style={{ color: '#14B8A6' }}>Expert Verified</span>
            </div>
          </div>

          <h2 className="font-bold mb-4 leading-tight" style={{ fontSize: 'clamp(22px,3vw,28px)', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: '1.25' }}>
            {post.title}
          </h2>
          <p className="mb-8 leading-relaxed" style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.75' }}>
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.slice(0, 3).map(t => (
              <span key={t} className="px-3 py-1 rounded-lg text-xs font-medium"
                style={{ background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }}>
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Author + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-6"
          style={{ borderTop: '1px solid #F1F5F9' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
              {post.author.avatar}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#0F172A' }}>{post.author.name}</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>{post.author.role} · {post.publishDate}</p>
            </div>
          </div>
          <Link to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all group/btn"
            style={{ background: '#2563EB', color: '#FFFFFF', boxShadow: '0 1px 3px rgba(37,99,235,0.3)', minHeight: 'unset', minWidth: 'unset' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1D4ED8'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#2563EB'; }}>
            Read Article
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
