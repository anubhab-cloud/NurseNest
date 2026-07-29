import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Phone, User, LogOut, LayoutDashboard,
  Home, Briefcase, Info, BookOpen, Mail, Tag, Calendar,
  Sparkles, ShieldCheck, ChevronRight, ArrowRight
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
      {/* ─── Fixed Header Wrapper ────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
        
        {/* ─── 1. Top Announcement & Emergency Hotline Bar ───────────────────── */}
        <div className={`pointer-events-auto bg-slate-900/80 backdrop-blur-md text-white text-xs py-1.5 transition-all duration-300 ${scrolled ? 'hidden lg:block border-b border-slate-800/50' : 'block border-b border-slate-800/30'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                24/7 Home Nursing Active
              </span>
              <span className="hidden md:inline text-slate-300 text-[11px] font-medium">
                Certified ICU, Elderly & Caregiver Specialists Available Near You
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href="tel:1800000000" 
                className="flex items-center gap-1.5 text-slate-200 hover:text-white font-medium transition-colors text-[11px]"
              >
                <Phone className="w-3 h-3 text-teal-400" />
                <span>Toll-Free: <strong className="text-white">1800-000-000</strong></span>
              </a>
              <span className="hidden sm:inline text-slate-700">|</span>
              <div className="hidden sm:flex items-center gap-1 text-slate-300 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>100% NABH Verified Care</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2. Main Navigation Bar ────────────────────────────────────────── */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto transition-all duration-300 ${
            scrolled
              ? 'py-2 sm:py-3 px-3 sm:px-6'
              : 'py-3 sm:py-4 px-3 sm:px-6'
          }`}
        >
          <div className={`max-w-7xl mx-auto transition-all duration-300 rounded-2xl sm:rounded-full ${
            scrolled
              ? 'bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-900/5 px-4 sm:px-6 py-2.5'
              : 'bg-transparent border-transparent shadow-none px-4 sm:px-6 py-3'
          }`}>
            <div className="flex items-center justify-between">

              {/* Brand Logo */}
              <Link 
                to="/" 
                className="shrink-0 flex items-center group transition-transform duration-200 active:scale-95" 
                style={{ minHeight: 'unset', minWidth: 'unset' }}
              >
                <NurseNestLogo size={36} />
              </Link>

              {/* Desktop Navigation Links */}
              <nav className={`hidden lg:flex items-center gap-1 p-1.5 rounded-full transition-all duration-300 ${
                scrolled
                  ? 'bg-slate-100/70 border border-slate-200/50'
                  : 'bg-white/50 backdrop-blur-md border border-white/80 shadow-sm'
              }`}>
                {navLinks.map(l => {
                  const active = isActive(l.href);
                  return (
                    <Link
                      key={l.href} 
                      to={l.href}
                      className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                        active ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      {active && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-white rounded-full shadow-sm border border-blue-200/60"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <l.icon className={`w-3.5 h-3.5 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        {l.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Right Side Actions */}
              <div className="hidden lg:flex items-center gap-3">
                {isAuthenticated ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setUserMenu(v => !v)}
                      className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all"
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover shadow-sm border border-white flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                      )}
                      <span className="text-xs font-semibold text-slate-800">{user?.firstName}</span>
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
                      className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-4 py-2 rounded-full hover:bg-slate-100/80 transition-all"
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/booking"
                      className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 overflow-hidden border border-white/20"
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      {/* Shimmer sweep effect */}
                      <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
                      
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse flex-shrink-0" />
                      <span className="relative z-10">Book Consult</span>
                      <span className="relative z-10 bg-emerald-400/25 text-emerald-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-emerald-300/30 tracking-widest">
                        FREE
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-1 group-hover:text-white transition-transform flex-shrink-0" />
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

