import { motion } from 'framer-motion';
import type { BlogPost } from '../../lib/blogData';
import { CATEGORIES } from '../../lib/blogData';

interface Props {
  active: string;
  onChange: (id: string) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {CATEGORIES.map((cat, i) => (
        <motion.button
          key={cat.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04 }}
          onClick={() => onChange(cat.id)}
          className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            minHeight: 'unset',
            minWidth: 'unset',
            background: active === cat.id ? '#2563EB' : '#FFFFFF',
            color:      active === cat.id ? '#FFFFFF'  : '#64748B',
            border:     `1px solid ${active === cat.id ? '#2563EB' : '#E2E8F0'}`,
            boxShadow:  active === cat.id ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
          }}>
          {cat.label}
          <span className="text-xs px-1.5 py-0.5 rounded-full"
            style={{
              background: active === cat.id ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
              color:      active === cat.id ? '#FFFFFF' : '#94A3B8',
              lineHeight: '1',
            }}>
            {cat.count}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
