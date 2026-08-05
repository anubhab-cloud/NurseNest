import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, User, LogOut, LayoutDashboard,
  Home, Briefcase, Info, BookOpen, Mail, Tag, Calendar,
  ChevronRight, ArrowRight, Sparkles, Phone, ShieldCheck, Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NurseNestLogo from '../brand/NurseNestLogo';

const navLinks = [
  { label: 'Home',     href: '/',        icon: Home },
  { label: 'Services', href: '/services', icon: Briefcase },
  { label: 'Pricing',  href: '/pricing',  icon: Tag },
  { label: 'About',    href: '/about',    icon: Info },
  { label: 'Blog',     href: '/blog',     icon: BookOpen },
  { label: 'Contact',  href: '/contact',  icon: Mail },
];

const bottomTabs = [
  { label: 'Home',    href: '/',        icon: Home },
  { label: 'Services',href: '/services', icon: Briefcase },
  { label: 'Book',    href: '/booking', icon: Calendar, primary: true },
  { label: 'Blog',    href: '/blog',    icon: BookOpen },
  { label: 'Account', href: '/login',   icon: User },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [userMenu, setUserMenu]     = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const menuRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setDrawerOpen(false); setUserMenu(false); }, [location.pathname]);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenu(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleLogout = () => { logout(); navigate('/'); };
  const dashPath = user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'nurse' ? '/dashboard/nurse' : '/dashboard/patient';
  const isActive = (href: string) => href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <>
      {/* ═══ Fixed Full-Width Header ═══════════════════════════════════════════ */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : ''
      }`}>

        {/* ── Top Announcement Bar ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`bg-white border-b border-slate-100 transition-all duration-300 ${
            scrolled ? 'hidden' : 'block'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
            {/* Left: trust badges */}
            <div className="flex items-center gap-4 text-[12px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>Trusted by <strong className="text-slate-800 font-semibold">10,000+</strong> families</span>
              </div>
              <span className="text-slate-200 hidden sm:inline">·</span>
              <div className="hidden sm:flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>24/7 Care Support</span>
              </div>
            </div>
            {/* Right: phone + NABH */}
            <div className="flex items-center gap-3 text-[12px] text-slate-600">
              <a
                href="tel:1800000000"
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Toll Free: <strong className="font-semibold">1800-000-000</strong></span>
              </a>
              <span className="text-slate-200 hidden md:inline">·</span>
              <div className="hidden md:flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>NABH Verified Care</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Main Navigation Row ───────────────────────────────────────────── */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border-b border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-[70px] gap-6">

              {/* Logo */}
              <Link
                to="/"
                className="shrink-0 flex items-center transition-transform duration-200 active:scale-95"
                style={{ minHeight: 'unset', minWidth: 'unset' }}
              >
                <NurseNestLogo size={38} />
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
                {navLinks.map(l => {
                  const active = isActive(l.href);
                  return (
                    <Link
                      key={l.href}
                      to={l.href}
                      className={`relative px-4 py-2 rounded-full text-[14px] font-medium transition-all duration-200 ${
                        active
                          ? 'text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      {active && (
                        <motion.div
                          layoutId="nav-active-pill"
                          className="absolute inset-0 bg-blue-50 rounded-full"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{l.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Right Actions */}
              <div className="hidden lg:flex items-center gap-2 shrink-0">
                {isAuthenticated ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setUserMenu(v => !v)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all"
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      {user?.avatar ? (
                        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-white shadow-sm">
                          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                      )}
                      <span className="text-[14px] font-medium text-slate-800">{user?.firstName}</span>
                    </button>

                    <AnimatePresence>
                      {userMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-1.5"
                        >
                          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 rounded-t-xl">
                            <p className="font-bold text-slate-900 text-sm">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-slate-500 capitalize mt-0.5 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                              {user?.role} Account
                            </p>
                          </div>
                          <div className="py-1">
                            {[
                              { icon: LayoutDashboard, label: 'Dashboard', href: dashPath },
                              { icon: User, label: 'Profile Settings', href: dashPath },
                            ].map(item => (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setUserMenu(false)}
                                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                                style={{ minHeight: 'unset', minWidth: 'unset' }}
                              >
                                <item.icon className="w-4 h-4 text-slate-400" /> {item.label}
                              </Link>
                            ))}
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                            >
                              <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[14px] font-medium text-slate-700 hover:text-blue-600 px-4 py-2.5 rounded-full hover:bg-slate-50 transition-all"
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/booking"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold px-5 py-2.5 rounded-full shadow-md shadow-blue-200/80 hover:shadow-lg hover:shadow-blue-300/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      Book a Consult
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setDrawerOpen(v => !v)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                aria-label="Open menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {drawerOpen ? (
                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

            </div>
          </div>
        </motion.header>
      </div>

      {/* ─── Mobile Slide Drawer ────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden flex flex-col shadow-2xl border-l border-slate-100 overflow-y-auto"
              style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center" style={{ minHeight: 'unset', minWidth: 'unset' }}>
                  <NurseNestLogo size={32} />
                </Link>
                <button 
                  onClick={() => setDrawerOpen(false)} 
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isAuthenticated && (
                <div className="mx-5 mt-5 bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100/80 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-blue-600 font-medium capitalize">{user?.role} Account</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 px-4 py-5 space-y-1">
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Navigation</p>
                {navLinks.map((l, i) => {
                  const active = isActive(l.href);
                  return (
                    <motion.div
                      key={l.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      <Link 
                        to={l.href} 
                        onClick={() => setDrawerOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          active
                            ? 'bg-blue-50 text-blue-600 border border-blue-100'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                        style={{ minHeight: 'unset', minWidth: 'unset' }}
                      >
                        <div className="flex items-center gap-3">
                          <l.icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span>{l.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${active ? 'text-blue-500' : 'text-slate-300'}`} />
                      </Link>
                    </motion.div>
                  );
                })}

                {isAuthenticated && (
                  <>
                    <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 mt-6">Account Control</p>
                    <Link 
                      to={dashPath} 
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      <span>Dashboard</span>
                    </Link>
                  </>
                )}
              </nav>

              <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
                {isAuthenticated ? (
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <>
                    <Link 
                      to="/booking" 
                      onClick={() => setDrawerOpen(false)}
                      className="group relative w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full shadow-lg shadow-teal-500/25 overflow-hidden border border-white/20"
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                      <span>Book Consultation</span>
                      <span className="bg-emerald-400/25 text-emerald-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-emerald-300/30 tracking-widest">
                        FREE
                      </span>
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      to="/login" 
                      onClick={() => setDrawerOpen(false)}
                      className="w-full flex items-center justify-center py-3 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      Sign In
                    </Link>
                  </>
                )}
                <a 
                  href="tel:1800000000"
                  className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500"
                  style={{ minHeight: 'unset', minWidth: 'unset' }}
                >
                  <Phone className="w-3.5 h-3.5 text-teal-500" /> 1800-000-000 (Toll Free)
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Bottom Navigation Bar (Mobile Only) ────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around px-3 py-2">
          {bottomTabs.map(tab => {
            const active = isActive(tab.href);
            const authHref = tab.href === '/login' && isAuthenticated ? dashPath : tab.href;
            return tab.primary ? (
              <Link 
                key={tab.href} 
                to={tab.href}
                className="flex flex-col items-center -mt-6"
                style={{ minHeight: 'unset', minWidth: 'unset' }}
              >
                <div className="w-13 h-13 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 p-3 mb-1 border-2 border-white">
                  <tab.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-bold text-blue-600">{tab.label}</span>
              </Link>
            ) : (
              <Link 
                key={tab.href} 
                to={authHref}
                className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors"
                style={{ minHeight: 'unset', minWidth: 'unset' }}
              >
                <tab.icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className={`text-[10px] font-semibold ${active ? 'text-blue-600' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

