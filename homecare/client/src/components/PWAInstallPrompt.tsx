import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Download, X, CheckCircle } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // ─── Register Service Worker ──────────────────────────────────────────────
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('[PWA] Service Worker registered with scope:', reg.scope))
          .catch((err) => console.warn('[PWA] Service Worker registration failed:', err));
      });
    }

    // ─── Capture Install Prompt Event ──────────────────────────────────────────
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('[PWA] NurseNest App was successfully installed!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt || installed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 right-6 z-50 max-w-sm bg-white/95 backdrop-blur-xl border border-blue-100 shadow-2xl rounded-3xl p-4 flex items-center gap-3.5"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
          <Smartphone className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Install App</p>
          <p className="text-sm font-extrabold text-slate-900 leading-snug truncate">Get NurseNest on Mobile</p>
          <p className="text-[11px] text-slate-500">Instant bookings & offline health access</p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-md"
            style={{ minHeight: 'unset', minWidth: 'unset' }}
          >
            <Download className="w-3.5 h-3.5" /> Install
          </button>

          <button
            onClick={() => setShowPrompt(false)}
            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            style={{ minHeight: 'unset', minWidth: 'unset' }}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
