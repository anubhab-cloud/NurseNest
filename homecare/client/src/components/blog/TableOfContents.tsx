import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';

interface Heading { id: string; text: string; level: number; }

function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split('\n');
  const headings: Heading[] = [];
  lines.forEach(line => {
    const m = line.match(/^(#{1,3})\s+(.+)/);
    if (m) {
      const text = m[2].trim();
      headings.push({ id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-'), text, level: m[1].length });
    }
  });
  return headings;
}

export default function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);
  const [active, setActive] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { const visible = entries.find(e => e.isIntersecting); if (visible) setActive(visible.target.id); },
      { rootMargin: '-20% 0% -60% 0%' }
    );
    headings.forEach(h => { const el = document.getElementById(h.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="rounded-2xl p-5 sticky top-24" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <List className="w-4 h-4" style={{ color: '#2563EB' }} />
        <h6 className="font-semibold" style={{ color: '#0F172A', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Table of Contents
        </h6>
      </div>
      <nav className="space-y-1">
        {headings.map(h => (
          <a key={h.id} href={`#${h.id}`}
            className="flex items-start gap-2 py-1.5 px-2 rounded-lg transition-all text-sm leading-snug"
            style={{
              paddingLeft: h.level === 2 ? '8px' : h.level === 3 ? '16px' : '8px',
              color: active === h.id ? '#2563EB' : '#64748B',
              background: active === h.id ? '#EFF6FF' : 'transparent',
              fontWeight: active === h.id ? 600 : 400,
              minHeight: 'unset',
              minWidth: 'unset',
            }}
            onClick={e => {
              e.preventDefault();
              const el = document.getElementById(h.id);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}>
            {active === h.id && (
              <motion.div layoutId="toc-indicator" className="w-0.5 h-4 rounded-full flex-shrink-0 mt-0.5"
                style={{ background: '#2563EB' }} />
            )}
            <span className={active === h.id ? '' : 'ml-1.5'}>{h.text}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
