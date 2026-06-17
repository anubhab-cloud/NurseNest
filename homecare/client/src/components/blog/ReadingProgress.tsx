import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const spring = useSpring(0, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? Math.min((scrolled / total) * 100, 100) : 0;
      setProgress(pct);
      spring.set(pct);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [spring]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5" style={{ background: '#E2E8F0' }}>
      <motion.div className="h-full" style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg,#2563EB,#14B8A6)',
        transition: 'width 0.1s linear',
      }} />
    </div>
  );
}
