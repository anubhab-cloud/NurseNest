import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Eye, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../../lib/blogData';

interface Props { post: BlogPost; index?: number; }

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  'Elder Care':    { bg: '#DBEAFE', text: '#1D4ED8' },
  'Nursing Care':  { bg: '#CCFBF3', text: '#0D9488' },
  'Physiotherapy': { bg: '#EDE9FE', text: '#6D28D9' },
  'Post Surgery':  { bg: '#FEE2E2', text: '#B91C1C' },
  'Child Care':    { bg: '#FCE7F3', text: '#BE185D' },
  'Mental Health': { bg: '#FEF9C3', text: '#B45309' },
  'Emergency':     { bg: '#FEF2F2', text: '#B91C1C' },
  'Health Tips':   { bg: '#D1FAE5', text: '#065F46' },
  'Nutrition':     { bg: '#FFF7ED', text: '#C2410C' },
};

const DEFAULT_CAT = { bg: '#E0EFFF', text: '#1E40AF' };

export default function BlogCard({ post, index = 0 }: Props) {
  const cat = CAT_COLORS[post.category] ?? DEFAULT_CAT;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
    >
      {/* Cover — fixed height, prevents uneven cards */}
      <div className="relative h-[200px] overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
          style={{ background: post.coverGradient }}>
          <span className="text-7xl opacity-60 select-none">{post.coverEmoji}</span>
        </div>
        {/* Category badge overlay */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: cat.bg, color: cat.text }}>
            {post.category}
          </span>
        </div>
        {/* Read time overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <Clock className="w-3 h-3" style={{ color: '#64748B' }} />
          <span className="text-xs font-medium" style={{ color: '#64748B' }}>{post.readTime} min</span>
        </div>
      </div>

      {/* Body — flex-grow so all cards stretch to same height in a row */}
      <div className="flex flex-col flex-1 p-6">
        {/* Title */}
        <h3 className="font-bold leading-snug mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors"
          style={{ fontSize: '18px', color: '#0F172A', letterSpacing: '-0.01em', lineHeight: '1.4' }}>
          {post.title}
        </h3>
        {/* Excerpt */}
        <p className="text-sm leading-relaxed mb-4 line-clamp-2 flex-1"
          style={{ color: '#64748B', lineHeight: '1.65' }}>
          {post.excerpt}
        </p>

        {/* Author + meta */}
        <div className="flex items-center justify-between pt-4"
          style={{ borderTop: '1px solid #F1F5F9' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
              {post.author.avatar}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#0F172A' }}>{post.author.name}</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>{post.publishDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#94A3B8' }}>
            <Eye className="w-3.5 h-3.5" />
            {(post.views / 1000).toFixed(1)}k
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <Link to={`/blog/${post.slug}`}
        className="flex items-center justify-between px-6 py-4 transition-colors group/link"
        style={{ borderTop: '1px solid #F1F5F9', background: '#FAFAFA', minHeight: 'unset', minWidth: 'unset' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F0F7FF'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FAFAFA'; }}>
        <span className="text-sm font-semibold" style={{ color: '#2563EB' }}>Read Article</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" style={{ color: '#2563EB' }} />
      </Link>
    </motion.article>
  );
}
